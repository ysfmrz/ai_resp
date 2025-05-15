# ai_response.py
import httpx
import os
import re
import subprocess
from io import BytesIO
import uuid
import logging
from datetime import datetime
from fastapi import HTTPException
from openai import AsyncOpenAI, OpenAI
from typing import Optional, Dict, Any
from bson import ObjectId
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from database import (
    ai_configs_collection, whatsapp_configs_collection, processed_messages_collection,
    messages_collection, customers_collection, products_collection, prompts_collection,
    conversation_threads_collection
)
from auth import get_user_token
import asyncio
import json
import hashlib
import tempfile

from sentence_transformers import SentenceTransformer, util
import random
import numpy as np
import torch



# تنظیم لاگینگ
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_response.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

##################################################################################

model = SentenceTransformer("intfloat/multilingual-e5-large")

def prepare(text): return "query: " + text.strip()

buy_intents = [
    "query: buy", "query: order", "query: purchase", "query: i want to buy",
    "query: how to buy", "query: can i order", "query: where to buy"
]
buy_embeddings = model.encode(buy_intents, convert_to_tensor=True)

def has_buy_intent(user_input: str, threshold: float = 0.8) -> bool:
    user_embedding = model.encode(prepare(user_input), convert_to_tensor=True)
    score = util.pytorch_cos_sim(user_embedding, buy_embeddings)[0].max().item()
    return score >= threshold




def get_user_products_with_urls(user_id: str) -> list[dict]:
    """
    گرفتن محصولات دارای name و buyurl (داخل attributes) برای یک کاربر
    """
    products = products_collection.find({
        "user_id": ObjectId(user_id),
        "isAvailable": True,
        "attributes.buyurl": {"$exists": True, "$ne": ""}
    })

    result = []
    for p in products:
        name = p.get("name")
        buyurl = p.get("attributes", {}).get("buyurl", "").strip()
        imgurl = p.get("images", [])
        imgurl=random.choice(imgurl) if imgurl else None        
        if name and buyurl:
            result.append({"name": name, "buyurl": buyurl, "imgurl": imgurl})
    return result


def normalize(text: str) -> str:
    return re.sub(r"[^\w\s]", "", text.lower().strip())

def match_best_products(user_text: str, products: list[str], top_k: int = 1, threshold: float = 0.6, strict: bool = True) -> list[str]:
    """
    تطبیق هوشمند + سخت‌گیرانه برای پیدا کردن محصول
    """
    query_text = f"query: {user_text.strip()}"
    passages = [f"passage: {name.strip()}" for name in products]

    query_embedding = model.encode(query_text, convert_to_tensor=True)
    product_embeddings = model.encode(passages, convert_to_tensor=True)

    similarities = util.cos_sim(query_embedding, product_embeddings)[0]

    top_results = similarities.topk(k=top_k)
    top_indices = top_results.indices.tolist()
    top_scores = top_results.values.tolist()

    

    result = []
    for i, score in zip(top_indices, top_scores):
        if score >= threshold:
            product_name = products[i]
            print('\n\n\n',product_name)
            # اگر strict باشه بررسی کنیم که آیا بخشی از نام محصول در متن هست یا نه
            if strict:
                norm_user = normalize(user_text)
                norm_prod = normalize(product_name)
                if any(w in norm_user for w in norm_prod.split()):
                    result.append(product_name)
            else:
                result.append(product_name)

    return result



async def check_purchase_and_generate_response(message_text: str, user_id: str) -> str | None:
    """
    بررسی نیت خرید و پاسخ‌دهی مناسب در صورت تشخیص intent و محصول
    """
    matched_intents = has_buy_intent(message_text)
    print('\n\n\n',matched_intents)
    if not matched_intents:
        return None  # نیت خرید تشخیص داده نشد

    # گرفتن لیست محصولات
    user_id = str(user_id).strip()
    products = get_user_products_with_urls(user_id)
    print('\n\n\n',products)
    if not products:
        return None

    product_names = [p["name"] for p in products]
    matched_product_names = match_best_products(message_text, product_names, top_k=1)
    print('\n\n\n',matched_product_names)

    if matched_product_names:
        # محصول پیدا شد، برگشت لینک خرید + "Order temp"
        for p in products:
            if p["name"] in matched_product_names:
                return f"{p['buyurl']} {p['imgurl']}  Order temp"

    # نیت خرید هست ولی اسم محصول نبود → پیشنهاد با مثال رندوم
    random_product = random.choice(product_names)
    return (
        f"يرجى كتابة طلب الشراء بهذا الشكل:\n"
        f"أرغب في شراء {random_product}\n\n"
        f"Please write your purchase request like this:\n"
        f"I want to buy {random_product}"
    )

################################################################################

def check_ai_config():
    """
    چک کردن تنظیمات AI فعال و برگرداندن تنظیمات
    """
    return ai_configs_collection.find_one({"auto_response_enabled": True})

def sanitize_input(text: str) -> str:
    """
    حذف هر چیزی که شبیه کد پایتون یا دستور خطرناک باشد
    """
    dangerous_patterns = r'\b(import|eval|exec|os\.|subprocess\.|__import__)\b'
    if re.search(dangerous_patterns, text, re.IGNORECASE):
        logger.warning(f"Detected dangerous input: {text}")
        return "Invalid input detected"
    sanitized = re.sub(r'[^\w\s,.?!-]', '', text)
    return sanitized.strip()



async def upload_json_file(client: OpenAI, product_data: list, user_id: str) -> str:
    """
    آپلود فایل JSON محصولات به OpenAI و بازگشت file_id
    """
    try:
        # ایجاد فایل موقت برای JSON
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as temp_file:
            json.dump(product_data, temp_file, ensure_ascii=False, indent=2)
            temp_file_path = temp_file.name

        # آپلود فایل به OpenAI
        with open(temp_file_path, 'rb') as file:
            file_response = client.files.create(
                file=file,
                purpose="assistants"
            )
        os.unlink(temp_file_path)  # حذف فایل موقت
        logger.info(f"Uploaded JSON file for user_id={user_id}, file_id={file_response.id}")
        return file_response.id
    except Exception as e:
        logger.error(f"Error uploading JSON file for user_id={user_id}: {str(e)}")
        raise

async def create_assistant(client: OpenAI, user_id: str, file_id: str, key_points: list, guidelines: list, warnings: list) -> tuple[str, str]:
    system_prompt = f"""
You are an assistant working with a JSON dataset stored in a file.
Follow these prompts to guide your responses:

Key Points:
{chr(10).join(f"- {kp}" for kp in key_points) if key_points else "None"}

Guidelines:
{chr(10).join(f"- {gl}" for gl in guidelines) if guidelines else "None"}

Warnings:
{chr(10).join(f"- {wr}" for wr in warnings) if warnings else "None"}

Important!:Only use the information in the attached file. Do not use any outside knowledge or general world facts. Do not search the web.
Important!:Keep answers brief, but make sure they still fully address the question.
Important!:Answer in the same language as the question, using natural conversational writing.
"""
    try:
        # ایجاد Vector Store و اتصال فایل
        vector_store = client.vector_stores.create(name=f"PropertiesVectorStore_{user_id}")
        client.vector_stores.file_batches.create(
            vector_store_id=vector_store.id,
            file_ids=[file_id]
        )

        # ایجاد Assistant با اتصال به Vector Store
        async_client = AsyncOpenAI(api_key=client.api_key)
        assistant = await async_client.beta.assistants.create(  # همچنان از beta برای assistants استفاده می‌شود
            name="RealEstateAssistant",
            instructions=system_prompt,
            model="gpt-4o-mini",
            tools=[{"type": "file_search"}],
            tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
        )
        logger.info(f"Created new Assistant with ID: {assistant.id} for user_id={user_id}")
        return assistant.id, vector_store.id
    except Exception as e:
        logger.error(f"Error creating Assistant for user_id={user_id}: {str(e)}")
        raise

async def cancel_all_active_runs_for_user(client: AsyncOpenAI, user_id: str):
    """
    لغو تمام runهای فعال برای تردهای مرتبط با کاربر.
    """
    try:
        user_threads = conversation_threads_collection.find({"user_id": ObjectId(user_id)})
        for thread_entry in user_threads:
            thread_id = thread_entry.get("thread_id")
            if not thread_id:
                continue

            runs = await client.beta.threads.runs.list(thread_id=thread_id)
            for run in runs.data:
                if run.status in ("queued", "in_progress", "cancelling"):
                    try:
                        await client.beta.threads.runs.cancel(thread_id=thread_id, run_id=run.id)
                        logger.info(f"Cancelled run {run.id} for thread {thread_id}")
                        await asyncio.sleep(1)
                    except Exception as e:
                        logger.warning(f"Failed to cancel run {run.id} on thread {thread_id}: {str(e)}")
    except Exception as e:
        logger.error(f"Error cancelling runs for user_id={user_id}: {str(e)}")



@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry=retry_if_exception_type(Exception),
    before_sleep=lambda retry_state: logger.warning(
        f"Retrying OpenAI Assistants API request (attempt {retry_state.attempt_number}/3) after {retry_state.idle_for}s due to: {retry_state.outcome.exception()}"
    )
)
async def call_openai(client: AsyncOpenAI, message_text: str, message_id: str, user_id: str, customer_id: str) -> str:
    """
    فراخوانی OpenAI Assistants API برای تحلیل املاک با حفظ تاریخچه مکالمه بر اساس customer_id.
    """
    try:
        user_id = str(user_id).strip()
        customer_id = str(customer_id).strip()
        logger.debug(f"Normalized user_id={user_id}, customer_id={customer_id} for message_id={message_id}")
        if not user_id or not customer_id:
            logger.error(f"Missing user_id or customer_id for message_id={message_id}")
            return "User ID and Customer ID required for property analysis"

        # فیلتر کردن ورودی
        message_text = sanitize_input(message_text)
        if message_text == "Invalid input detected":
            logger.error(f"Blocked dangerous input for message_id={message_id}")
            return "Invalid input detected"

        # خواندن مستقیم داده‌های محصولات از دیتابیس
        products = list(products_collection.find({"user_id": ObjectId(user_id)}))
        if not products:
            logger.debug(f"No products found in DB for user_id={user_id}")
            return "No properties found"

        # خواندن مستقیم پرامپت‌ها از دیتابیس
        prompts = list(prompts_collection.find({"user_id": ObjectId(user_id)}))
        if not prompts:
            logger.debug(f"No prompts found in DB for user_id={user_id}")
            return "No prompts found"

        # آماده‌سازی داده‌های محصولات به صورت JSON
        product_data = []
        for product in products:
            if not product.get("name") or not product.get("price"):
                logger.warning(f"Skipping incomplete product: {product.get('_id')}")
                continue
            product_data.append({
                "_id": str(product["_id"]),  # تبدیل ObjectId به رشته
                "name": product.get("name", ""),
                "description": product.get("description", ""),
                "price": product.get("price", 0),
                "category": product.get("category", ""),
                "subCategory": product.get("subCategory", None),
                "isAvailable": product.get("isAvailable", False),
                "mainImageIndex": product.get("mainImageIndex", 0),
                "created_at": product.get("created_at").isoformat() if product.get("created_at") and isinstance(product.get("created_at"), datetime) else None,
                "updated_at": product.get("updated_at").isoformat() if product.get("updated_at") and isinstance(product.get("updated_at"), datetime) else None,
                "user_id": str(product.get("user_id", "")),  # تبدیل ObjectId به رشته
                "images": product.get("images", []),
                "attributes": product.get("attributes", {})
            })

        # فیلتر محصولات موجود
        product_data = [p for p in product_data if p["isAvailable"]]
        if not product_data:
            logger.debug(f"No available properties found for user_id={user_id}")
            return "No available properties found"

        # آماده‌سازی پرامپت‌ها
        key_points = [p["text"] for p in prompts if p.get("type") == "keyPoint"]
        guidelines = [p["text"] for p in prompts if p.get("type") == "guideline"]
        warnings = [p["text"] for p in prompts if p.get("type") == "warning"]

        # تبدیل داده‌های پرامپت‌ها به فرمت قابل سریال‌سازی
        prompts_serializable = []
        for prompt in prompts:
            prompt_serializable = {}
            for k, v in prompt.items():
                if isinstance(v, ObjectId):
                    prompt_serializable[k] = str(v)
                elif isinstance(v, datetime):
                    prompt_serializable[k] = v.isoformat()
                elif v is None or isinstance(v, (str, int, float, bool, list, dict)):
                    prompt_serializable[k] = v
                else:
                    prompt_serializable[k] = str(v)  # تبدیل هر نوع غیرمنتظره به رشته
            prompts_serializable.append(prompt_serializable)

        # محاسبه هش محتوای محصولات و پرامپت‌ها
        content_json = json.dumps(product_data, sort_keys=True)
        prompts_json = json.dumps(prompts_serializable, sort_keys=True)
        content_hash = hashlib.md5((content_json + prompts_json).encode()).hexdigest()

        ai_config = ai_configs_collection.find_one({"user_id": ObjectId(user_id), "auto_response_enabled": True})
        if not ai_config or not ai_config.get("api_key"):
            logger.error(f"No valid AI config for user_id={user_id}, message_id={message_id}")
            return "AI configuration not found"

        # ایجاد کلاینت همزمان برای عملیات فایل و Vector Store
        sync_client = OpenAI(api_key=ai_config["api_key"])

        # بررسی تغییرات در محصولات یا پرامپت‌ها و ایجاد Assistant جدید در صورت نیاز
        assistant_id = ai_config.get("assistant_id")
        stored_hash = ai_config.get("content_hash", "")
        file_id = ai_config.get("file_id")
        vector_store_id = ai_config.get("vector_store_id")

        if not assistant_id or stored_hash != content_hash or not file_id:
            # آپلود فایل JSON جدید
            new_file_id = await upload_json_file(sync_client, product_data, user_id)
            
            # ایجاد Assistant جدید با فایل آپلودشده
            new_assistant_id, new_vector_store_id = await create_assistant(sync_client, user_id, new_file_id, key_points, guidelines, warnings)
            await cancel_all_active_runs_for_user(client, user_id)

            # حذف فایل قدیمی اگر وجود داشته باشد
            if file_id:
                try:
                    sync_client.files.delete(file_id)
                    logger.info(f"Deleted old file_id={file_id} for user_id={user_id}")
                except Exception as e:
                    logger.warning(f"Failed to delete old file_id={file_id}: {str(e)}")

            # حذف Vector Store قدیمی اگر وجود داشته باشد
            if vector_store_id:
                try:
                    sync_client.vector_stores.delete(vector_store_id)
                    logger.info(f"Deleted old vector_store_id={vector_store_id} for user_id={user_id}")
                except Exception as e:
                    logger.warning(f"Failed to delete old vector_store_id={vector_store_id}: {str(e)}")
                    
            # حذف تمام Threadهای قدیمی برای user_id
            try:
                delete_result = conversation_threads_collection.delete_many({"user_id": ObjectId(user_id)})
                logger.info(f"Deleted {delete_result.deleted_count} old threads for user_id={user_id}")
            except Exception as e:
                logger.warning(f"Failed to delete old threads for user_id={user_id}: {str(e)}")


            # به‌روزرسانی تنظیمات
            ai_configs_collection.update_one(
                {"user_id": ObjectId(user_id), "auto_response_enabled": True},
                {"$set": {
                    "assistant_id": new_assistant_id,
                    "file_id": new_file_id,
                    "vector_store_id": new_vector_store_id,
                    "content_hash": content_hash
                }}
            )
            assistant_id = new_assistant_id
            file_id = new_file_id
            vector_store_id = new_vector_store_id
            logger.info(f"Created and stored new assistant_id={assistant_id}, file_id={file_id}, vector_store_id={vector_store_id} for user_id={user_id} due to data change")
        else:
            logger.debug(f"Using existing assistant_id={assistant_id}, file_id={file_id} for user_id={user_id}")

        # پیدا کردن یا ایجاد Thread برای مشتری
        thread_entry = conversation_threads_collection.find_one({"customer_id": ObjectId(customer_id), "user_id": ObjectId(user_id)})
        if not thread_entry:
            thread_response = await client.beta.threads.create()
            thread_id = thread_response.id
            conversation_threads_collection.insert_one({
                "customer_id": ObjectId(customer_id),
                "user_id": ObjectId(user_id),
                "thread_id": thread_id,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            logger.info(f"Created new thread for customer_id={customer_id}, thread_id={thread_id}")
        else:
            thread_id = thread_entry["thread_id"]
            logger.debug(f"Using existing thread for customer_id={customer_id}, thread_id={thread_id}")

        # افزودن پیام به Thread
        await client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=message_text
        )
        logger.debug(f"Message added to thread {thread_id} for user_id={user_id}")

        # اجرای Thread با Assistants API
        run_response = await client.beta.threads.runs.create_and_poll(
            thread_id=thread_id,
            assistant_id=assistant_id,
            temperature=0.3,
            timeout=25
        )

        if run_response.status != "completed":
            logger.error(f"Run failed for thread_id={thread_id}, message_id={message_id}, status={run_response.status}")
            return "Could you please clarify your request or question?"

        # گرفتن پاسخ از Thread
        messages = await client.beta.threads.messages.list(thread_id=thread_id, run_id=run_response.id)
        response_text = ""
        for msg in messages.data:
            if msg.role == "assistant":
                response_text += msg.content[0].text.value + "\n"
        response_text = response_text.strip()
        if not response_text:
            logger.error(f"No assistant response found for thread_id={thread_id}, message_id={message_id}")
            return "Could you please clarify your request or question?"

        logger.info(f"Assistants API response for user_id={user_id}, customer_id={customer_id}, message_id={message_id}: {response_text}")

        # به‌روزرسانی زمان Thread
        conversation_threads_collection.update_one(
            {"customer_id": ObjectId(customer_id), "user_id": ObjectId(user_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )

        return response_text

    except Exception as e:
        logger.error(f"Error in call_openai for user_id={user_id}, customer_id={customer_id}, message_id={message_id}: {str(e)}")
        return "Could you please clarify your request or question?"

import random  # اضافه کردن برای انتخاب رندوم

async def send_ai_response(user_id: str, config_name: str, customer_id: str, ai_response: str) -> None:
    try:
        whatsapp_config = whatsapp_configs_collection.find_one({"name": config_name, "user_id": ObjectId(user_id)})
        if not whatsapp_config:
            logger.error(f"No WhatsApp config found for configName: {config_name}, user_id={user_id}")
            raise ValueError("WhatsApp config not found")


        sender = {
            "name": whatsapp_config["name"],
            "phone_number": whatsapp_config["phone_number"]
        }
        phone_number_id = whatsapp_config["phone_number_id"]
        access_token = whatsapp_config["access_token"]

        customer = customers_collection.find_one({"_id": ObjectId(customer_id)})
        if not customer:
            logger.error(f"Customer not found: {customer_id}")
            raise ValueError("Customer not found")

        recipient = {
            "type": "customer",
            "id": customer_id,
            "name": customer["full_name"],
            "whatsapp_number": customer["whatsapp_number"],
            "group_id": str(customer["group_id"]) if customer.get("group_id") else None
        }
        to_number = recipient["whatsapp_number"].replace("+", "") if recipient["whatsapp_number"].startswith("+") else recipient["whatsapp_number"]

        now = datetime.utcnow()
        message = {
            "sender": sender,
            "recipient": recipient,
            "title": "",
            "text": None,
            "files": [],
            "template_type": None,
            "template_id": None,
            "template_name": None,
            "whatsapp_message_ids": [],
            "status": "Sent",
            "created_at": now,
            "updated_at": now,
            "user_id": ObjectId(user_id)
        }

        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        message_url = f"https://graph.facebook.com/v22.0/{phone_number_id}/messages"

        # تغییر جدید: بررسی برای "(Order temp)" و دو URL با انتخاب رندوم رسانه
        if "co temp" in ai_response:
            # استخراج URLها
            all_urls = re.findall(r'(https?://\S+)', ai_response, re.IGNORECASE)
            media_url_pattern = r'(https?://\S+\.(?:jpg|jpeg|png|pdf|mp4|ogg|mp3))'
            media_urls = re.findall(media_url_pattern, ai_response, re.IGNORECASE)
            
            # بررسی وجود دقیقاً دو URL و حداقل یک URL رسانه‌ای
            if len(all_urls) == 2 and len(media_urls) >= 1:
                # انتخاب رندوم یک URL رسانه‌ای
                media_url = random.choice(media_urls)
                # پیدا کردن URL غیررسانه‌ای
                non_media_url = next(url for url in all_urls if url not in media_urls)
                
                try:
                    # تنظیمات تمپلت
                    template_name = "order_temp"
                    template_type = "approved"
                    template_id = template_name
                    waba_id = whatsapp_config.get("waba_id")

                    # بررسی وجود و وضعیت تمپلت
                    template_url = f"https://graph.facebook.com/v22.0/{waba_id}/message_templates"
                    async with httpx.AsyncClient() as client:
                        template_response = await client.get(template_url, headers=headers)
                        if template_response.status_code != 200:
                            logger.error(f"Failed to fetch templates for waba_id={waba_id}: {template_response.json()}")
                            raise ValueError(f"Failed to fetch templates: {template_response.json()}")
                        templates = template_response.json().get("data", [])
                        template = next((t for t in templates if t["name"] == template_name and t["language"] == "en_US"), None)
                        if not template:
                            logger.error(f"Template {template_name} with language en_US not found for waba_id={waba_id}")
                            raise ValueError(f"Template {template_name} with language en_US not found")
                        if template.get("status") != "APPROVED":
                            logger.error(f"Template {template_name} is not approved: status={template['status']}")
                            raise ValueError(f"Template {template_name} is not approved")

                    # دانلود و آپلود رسانه برای هدر
                    async with httpx.AsyncClient() as client:
                        response = await client.get(media_url, timeout=15)
                        if response.status_code != 200:
                            logger.error(f"Failed to download media from {media_url}: {response.status_code}")
                            raise ValueError(f"Failed to download media from {media_url}")

                        file_ext = os.path.splitext(media_url)[1].lower()
                        temp_file_path = os.path.join("uploads/messages", f"temp_media_{uuid.uuid4().hex}{file_ext}")
                        os.makedirs("uploads/messages", exist_ok=True)
                        with open(temp_file_path, "wb") as f:
                            f.write(response.content)

                        media_id = await upload_file_to_whatsapp(temp_file_path, phone_number_id, access_token, is_pdf=(file_ext == ".pdf"))
                        os.unlink(temp_file_path)
                        if not media_id:
                            logger.error(f"Failed to upload media from {media_url} to WhatsApp")
                            raise ValueError(f"Failed to upload media from {media_url}")

                    # تعیین نوع رسانه برای هدر
                    file_type = "document" if file_ext == ".pdf" else "image" if file_ext in [".jpg", ".jpeg", ".png"] else "video" if file_ext == ".mp4" else "audio"
                    header_component = {
                        "type": "header",
                        "parameters": [
                            {
                                "type": file_type,
                                file_type: {"id": media_id}
                            }
                        ]
                    }
                    if file_ext == ".pdf":
                        header_component["parameters"][0][file_type]["filename"] = f"Media{file_ext}"

                    # تنظیم دکمه با URL غیررسانه‌ای
                    button_component = {
                        "type": "button",
                        "sub_type": "url",
                        "index": 0,  # فرض می‌کنیم دکمه اول در تمپلت
                        "parameters": [
                            {
                                "type": "text",
                                "text": non_media_url
                            }
                        ]
                    }

                    # ساخت payload برای تمپلت
                    payload = {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": to_number,
                        "type": "template",
                        "template": {
                            "name": template_name,
                            "language": {"code": "en_US"},
                            "components": [header_component, button_component]
                        }
                    }

                    # ارسال درخواست
                    async with httpx.AsyncClient() as client:
                        response = await client.post(message_url, headers=headers, json=payload)
                        if response.status_code == 200:
                            message_id = response.json().get("messages", [{}])[0].get("id")
                            if not message_id:
                                logger.error(f"No message_id returned for template {template_name} to {to_number}")
                                raise ValueError("No message_id returned from WhatsApp API")
                            
                            # ثبت پیام در دیتابیس (فقط نام تمپلت)
                            message["text"] = ai_response
                            message["template_type"] = template_type
                            message["template_name"] = template_name
                            message["template_id"] = template_id
                            message["whatsapp_message_ids"] = [{"message_id": message_id}]
                            messages_collection.insert_one(message)
                            logger.info(f"Order template {template_name} with media and URL button sent for customer_id={customer_id}, message_id={message_id}")
                            return  # خروج زودهنگام
                        else:
                            logger.error(f"Failed to send template {template_name} to {to_number}: {response.json()}")
                            raise ValueError(f"Failed to send template: {response.json()}")
                except Exception as e:
                    logger.error(f"Error sending template {template_name} for customer_id={customer_id}: {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Failed to send order template: {str(e)}")

        # ادامه منطق اصلی برای ارسال پیام متنی، صوتی یا رسانه
        # بررسی شرایط تبدیل به صوت
        if (
            ai_response and
            not re.search(r'\d', ai_response) and
            not re.search(r'(https?://\S+|www\.\S+)', ai_response) and
            not re.search(r'[\+\-\*/=]', ai_response) and
            len(ai_response) < 160
        ):
            logger.debug(f"Converting response to audio: {ai_response}")
            async with AsyncOpenAI(api_key=check_ai_config()["api_key"]) as client:
                audio_data = await text_to_speech(ai_response, client)
                if audio_data:
                    temp_audio_path = os.path.join("uploads/messages", f"temp_audio_{uuid.uuid4().hex}.ogg")
                    os.makedirs("uploads/messages", exist_ok=True)
                    with open(temp_audio_path, "wb") as f:
                        f.write(audio_data.read())

                    media_id = await upload_file_to_whatsapp(temp_audio_path, phone_number_id, access_token)
                    if media_id:
                        payload = {
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": to_number,
                            "type": "audio",
                            "audio": {"id": media_id}
                        }
                        async with httpx.AsyncClient() as client:
                            response = await client.post(message_url, headers=headers, json=payload)
                            os.unlink(temp_audio_path)
                            if response.status_code == 200:
                                message_id = response.json().get("messages", [{}])[0].get("id")
                                message["text"] = ai_response
                                message["files"] = [f"audio_{media_id}.ogg"]
                                message["whatsapp_message_ids"] = [{"message_id": message_id}]
                                messages_collection.insert_one(message)
                                logger.info(f"AI audio response sent and saved for customer_id={customer_id}, message_id={message_id}")
                                return
                            else:
                                logger.error(f"Failed to send audio message: {response.json()}")
                                raise ValueError(f"Failed to send audio message: {response.json()}")
                    else:
                        os.unlink(temp_audio_path)
                        logger.error("Failed to upload audio to WhatsApp")
                        raise ValueError("Failed to upload audio")



        # پردازش URLهای رسانه
        media_urls = re.findall(r'(https?://\S+\.(?:jpg|jpeg|png|pdf|mp4|ogg|mp3))', ai_response, re.IGNORECASE)
        sent_media = False
        if media_urls:
            async with httpx.AsyncClient() as client:
                for media_url in media_urls:
                    try:
                        response = await client.get(media_url, timeout=15)
                        if response.status_code != 200:
                            logger.warning(f"Failed to download media from {media_url}")
                            continue

                        file_ext = os.path.splitext(media_url)[1].lower()
                        temp_file_path = os.path.join("uploads/messages", f"temp_media_{uuid.uuid4().hex}{file_ext}")
                        os.makedirs("uploads/messages", exist_ok=True)
                        with open(temp_file_path, "wb") as f:
                            f.write(response.content)

                        media_id = await upload_file_to_whatsapp(temp_file_path, phone_number_id, access_token, is_pdf=(file_ext == ".pdf"))
                        if media_id:
                            file_type = "document" if file_ext == ".pdf" else "image" if file_ext in [".jpg", ".jpeg", ".png"] else "video" if file_ext == ".mp4" else "audio"
                            payload = {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": to_number,
                                "type": file_type,
                                file_type: {"id": media_id}
                            }
                            if file_ext == ".pdf":
                                payload[file_type]["filename"] = f"Media{file_ext}"
                            response = await client.post(message_url, headers=headers, json=payload)
                            os.unlink(temp_file_path)
                            if response.status_code == 200:
                                message_id = response.json().get("messages", [{}])[0].get("id")
                                message["text"] = ai_response
                                message["files"] = [f"{file_type}_{media_id}{file_ext}"]
                                message["title"] = "Media"
                                message["whatsapp_message_ids"] = [{"message_id": message_id}]
                                messages_collection.insert_one(dict(message))  # کپی پیام برای جلوگیری از تداخل
                                logger.info(f"AI {file_type} response sent and saved for customer_id={customer_id}, message_id={message_id}")
                                sent_media = True
                            else:
                                logger.error(f"Failed to send {file_type} message: {response.json()}")
                                continue
                        else:
                            os.unlink(temp_file_path)
                            logger.error(f"Failed to upload media from {media_url}")
                            continue
                    except Exception as e:
                        if os.path.exists(temp_file_path):
                            os.unlink(temp_file_path)
                        logger.error(f"Error processing media from {media_url}: {str(e)}")
                        continue



        # حذف URLها از متن اصلی برای ارسال پیام متنی
        text_to_send = ai_response
        if media_urls:
            for url in media_urls:
                text_to_send = text_to_send.replace(url, "").strip()
        text_to_send = text_to_send.strip()

        # ارسال پیام متنی اگر متن غیرخالی وجود داشته باشد
        if text_to_send:
            message["text"] = text_to_send
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to_number,
                "type": "text",
                "text": {"body": text_to_send}
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(message_url, headers=headers, json=payload)
                if response.status_code == 200:
                    message_id = response.json().get("messages", [{}])[0].get("id")
                    message["whatsapp_message_ids"] = [{"message_id": message_id}]
                    if sent_media:
                        message["files"] = []  # فایل‌ها قبلاً برای رسانه ذخیره شده‌اند
                        message["title"] = ""
                    messages_collection.insert_one(dict(message))
                    logger.info(f"AI text response sent and saved for customer_id={customer_id}, message_id={message_id}")
                else:
                    logger.error(f"Failed to send text message: {response.json()}")
                    raise ValueError(f"Failed to send text message: {response.json()}")

    except Exception as e:
        logger.error(f"Error sending AI response for customer_id={customer_id}: {str(e)}")
        raise

def mark_message_processed(message_id: str, conversation_id: str, config_id: str) -> None:
    try:
        now = datetime.utcnow()
        processed_messages_collection.insert_one({
            "messageId": message_id,
            "processed_at": now,
            "conversation_id": conversation_id,
            "config_id": config_id
        })
        logger.debug(f"Marked message {message_id} as processed")
    except Exception as e:
        logger.error(f"Error marking message {message_id} as processed: {str(e)}")

async def read_message(phone_number_id: str, access_token: str, message_id: str) -> dict:
    try:
        url = f"https://graph.facebook.com/v22.0/{phone_number_id}/messages"
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        data = {
            "messaging_product": "whatsapp",
            "status": "read",
            "message_id": message_id
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            return response.json()
    except Exception as e:
        logger.error(f"Error marking message {message_id} as read: {str(e)}")
        return {"error": str(e)} 

def convert_mp3_to_whatsapp_voice(mp3_data: BytesIO) -> Optional[BytesIO]:
    try:
        mp3_data.seek(0)
        process = subprocess.Popen(
            ["ffmpeg", "-i", "pipe:0", "-c:a", "libopus", "-b:a", "16k", "-ar", "48000", "-ac", "1", "-application", "voip", "-f", "ogg", "pipe:1"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL
        )
        ogg_data, _ = process.communicate(input=mp3_data.read())
        return BytesIO(ogg_data)
    except Exception as e:
        logger.error(f"Error converting MP3 to OGG: {str(e)}")
        return None

async def text_to_speech(text: str, openai_client: AsyncOpenAI) -> Optional[BytesIO]:
    try:
        response = await openai_client.audio.speech.create(
            model="gpt-4o-mini-tts",
            instructions="Speak in an energetic and positive tone.",
            speed=0.9,
            voice="ash",
            input=text
        )
        audio_mp3 = BytesIO(response.content)
        audio_mp3.seek(0)
        return convert_mp3_to_whatsapp_voice(audio_mp3)
    except Exception as e:
        logger.error(f"Error in text_to_speech: {str(e)}")
        return None

async def upload_file_to_whatsapp(file_path: str, phone_number_id: str, access_token: str, is_pdf: bool = False, title: str = None) -> Optional[str]:
    upload_url = f"https://graph.facebook.com/v22.0/{phone_number_id}/media"
    headers = {"Authorization": f"Bearer {access_token}"}
    file_extension = os.path.splitext(file_path)[1].lower()
    mime_types = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
        ".pdf": "application/pdf", ".mp4": "video/mp4", ".ogg": "audio/ogg", ".mp3": "audio/mpeg"
    }
    mime_type = mime_types.get(file_extension, "application/octet-stream")
    upload_filename = f"{title}{file_extension}" if is_pdf and title else os.path.basename(file_path)
    
    async with httpx.AsyncClient() as client:
        with open(file_path, "rb") as file:
            files = {
                "file": (upload_filename, file, mime_type),
                "messaging_product": (None, "whatsapp")
            }
            response = await client.post(upload_url, headers=headers, files=files)
        if response.status_code == 200:
            return response.json().get("id")
        logger.error(f"Error uploading file {file_path}: {response.json()}")
        return None