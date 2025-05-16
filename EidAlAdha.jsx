import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaTimes, FaCreditCard, FaDrumstickBite, FaCut } from 'react-icons/fa';
import Modal from 'react-modal';
import { LanguageContext } from '../context/LanguageContext';

Modal.setAppElement('#root');

const EidAlAdha = () => {
    const { isRTL, toggleLanguage } = useContext(LanguageContext);

    // ترجمه‌ها درون کامپوننت
    const translations = {
        en: {
            title: 'Pre-Order Your Eid Al Adha Shuwa',
            subtitle: 'Celebrate Eid with Hyper Max’s authentic Omani Shuwa, marinated and wrapped with tradition.',
            howToBuy: 'Visit Us to Pre-Order',
            locations: [
                {
                    name: 'Mall of Oman',
                    address: 'Hyper Max, Mall of Oman, Al Maabilah, Muscat, Oman',
                    contact: '+968 2450 1234',
                    hours: '10:00 AM - 10:00 PM (Sat-Thu), 2:00 PM - 10:00 PM (Fri)',
                },
                {
                    name: 'Seeb',
                    address: 'Hyper Max, Seeb Souq, Al Seeb, Muscat, Oman',
                    contact: '+968 2440 5678',
                    hours: '9:00 AM - 9:00 PM (Sat-Thu), 3:00 PM - 9:00 PM (Fri)',
                },
                {
                    name: 'Nizwa',
                    address: 'Hyper Max, Nizwa Grand Mall, Nizwa, Oman',
                    contact: '+968 2541 9012',
                    hours: '10:00 AM - 9:00 PM (Sat-Thu), 2:00 PM - 9:00 PM (Fri)',
                },
            ],
            meatType: 'Choose Your Meat',
            meatOptions: [
                { value: 'lamb', label: 'Lamb', price: 8.5, desc: 'Tender and juicy, perfect for traditional Shuwa.', color: '#d4a017' },
                { value: 'goat', label: 'Goat', price: 7.0, desc: 'Lean and mildly gamey, a classic choice.', color: '#8b1e2d' },
                { value: 'beef', label: 'Beef', price: 6.5, desc: 'Robust and hearty, ideal for a memorable feast.', color: '#005A9E' },
                { value: 'camel', label: 'Camel', price: 9.0, desc: 'Unique and slightly sweet, an authentic Omani experience.', color: '#A5C93D' },
            ],
            cutType: 'Select Cutting Style',
            cutOptions: [
                { value: 'whole', label: 'Whole', desc: 'Kept intact for slow-cooking.', color: '#d4a017' },
                { value: 'quartered', label: 'Quartered', desc: 'Divided into four portions.', color: '#8b1e2d' },
                { value: 'diced', label: 'Diced', desc: 'Bite-sized pieces for quick marination.', color: '#005A9E' },
                { value: 'ground', label: 'Ground', desc: 'Finely ground for unique preparations.', color: '#A5C93D' },
            ],
            specialInstructions: 'Special Instructions',
            specialInstructionsPlaceholder: 'E.g., bone-in, extra trimming',
            spice: 'Spice Preference',
            spiceOptions: {
                spiced: 'With Hyper Max Spice Blend',
                unspiced: 'No Spices',
                spiceDesc: 'A blend of cumin, coriander, and local Omani spices.',
            },
            udhiyaTiming: 'Udhiha Timing',
            timingOptions: [
                { value: 'dayBefore', label: 'One Day Before Eid' },
                { value: 'day1', label: 'First Day of Eid' },
                { value: 'day2', label: 'Second Day of Eid' },
            ],
            delivery: 'Delivery',
            deliveryAddress: 'Delivery Address',
            payment: 'Payment Method',
            paymentOptions: {
                online: 'Pay Online (Visa Card)',
                inBranch: 'Pay In-Branch',
            },
            cardDetails: 'Card Details',
            cardHolder: 'Card Holder Name',
            cardNumber: 'Card Number',
            expiry: 'Expiry (MM/YY)',
            cvv: 'CVV',
            customerInfo: 'Customer Information',
            name: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            branch: 'Select Branch',
            orderSummary: 'Order Summary',
            total: 'Total',
            submitOrder: 'Submit Order',
            proceedToPayment: 'Proceed to Payment',
            edit: 'Edit',
            confirmOrder: 'Order Confirmation',
            confirmPayment: 'Confirm Payment',
            success: 'Your payment was successful!',
            successInBranch: 'Your order has been recorded!',
            successDesc: 'Thank you for your order. You’ll receive a confirmation soon.',
            close: 'Close',
            errors: {
                required: 'This field is required',
                email: 'Invalid email format',
                phone: 'Invalid phone number (8-15 digits)',
                name: 'Name must be at least 2 characters',
                cardHolder: 'Card holder name must be at least 2 characters',
                cardNumber: 'Card number must be 16 digits',
                expiry: 'Invalid expiry date (MM/YY)',
                cvv: 'CVV must be 3 digits',
            },
        },
        ar: {
            title: 'طلب مسبق لشواء عيد الأضحى',
            subtitle: 'احتفل بالعيد مع شواء هايبر ماكس الأصيل العماني، متبل ومغلف بالتقاليد.',
            howToBuy: 'زورونا للطلب المسبق',
            locations: [
                {
                    name: 'مول عمان',
                    address: 'هايبر ماكس، مول عمان، المعبيلة، مسقط، عمان',
                    contact: '+968 2450 1234',
                    hours: '١٠:٠٠ صباحًا - ١٠:٠٠ مساءً (السبت-الخميس)، ٢:٠٠ مساءً - ١٠:٠٠ مساءً (الجمعة)',
                },
                {
                    name: 'سيب',
                    address: 'هايبر ماكس، سوق سيب، السيب، مسقط، عمان',
                    contact: '+968 2440 5678',
                    hours: '٩:٠٠ صباحًا - ٩:٠٠ مساءً (السبت-الخميس)، ٣:٠٠ مساءً - ٩:٠٠ مساءً (الجمعة)',
                },
                {
                    name: 'نزوى',
                    address: 'هايبر ماكس، نزوى جراند مول، نزوى، عمان',
                    contact: '+968 2541 9012',
                    hours: '١٠:٠٠ صباحًا - ٩:٠٠ مساءً (السبت-الخميس)، ٢:٠٠ مساءً - ٩:٠٠ مساءً (الجمعة)',
                },
            ],
            meatType: 'اختر نوع اللحم',
            meatOptions: [
                { value: 'lamb', label: 'لحم الخروف', price: 8.5, desc: 'طري وعصيري، مثالي للشواء التقليدي.', color: '#d4a017' },
                { value: 'goat', label: 'لحم الماعز', price: 7.0, desc: 'خفيف ومميز، خيار كلاسيكي.', color: '#8b1e2d' },
                { value: 'beef', label: 'لحم البقر', price: 6.5, desc: 'قوي وشهي، مثالي لوليمة لا تُنسى.', color: '#005A9E' },
                { value: 'camel', label: 'لحم الإبل', price: 9.0, desc: 'فريد وحلو قليلاً، تجربة عمانية أصيلة.', color: '#A5C93D' },
            ],
            cutType: 'اختر طريقة التقطيع',
            cutOptions: [
                { value: 'whole', label: 'كامل', desc: 'يُحتفظ به سليمًا للطهي البطيء.', color: '#d4a017' },
                { value: 'quartered', label: 'مقسم إلى أرباع', desc: 'مقسم إلى أربعة أجزاء.', color: '#8b1e2d' },
                { value: 'diced', label: 'مقطع', desc: 'قطع صغيرة للتتبيل السريع.', color: '#005A9E' },
                { value: 'ground', label: 'مفروم', desc: 'مطحون ناعمًا لتحضيرات فريدة.', color: '#A5C93D' },
            ],
            specialInstructions: 'تعليمات خاصة',
            specialInstructionsPlaceholder: 'مثال: مع العظم، تقليم إضافي',
            spice: 'تفضيل التوابل',
            spiceOptions: {
                spiced: 'مع خلطة توابل هايبر ماكس',
                unspiced: 'بدون توابل',
                spiceDesc: 'مزيج من الكمون، الكزبرة، والتوابل العمانية المحلية.',
            },
            udhiyaTiming: 'توقيت الأضحية',
            timingOptions: [
                { value: 'dayBefore', label: 'يوم قبل العيد' },
                { value: 'day1', label: 'اليوم الأول من العيد' },
                { value: 'day2', label: 'اليوم الثاني من العيد' },
            ],
            delivery: 'التوصيل',
            deliveryAddress: 'عنوان التوصيل',
            payment: 'طريقة الدفع',
            paymentOptions: {
                online: 'الدفع عبر الإنترنت (فيزا كارد)',
                inBranch: 'الدفع في الفرع',
            },
            cardDetails: 'تفاصيل البطاقة',
            cardHolder: 'اسم حامل البطاقة',
            cardNumber: 'رقم البطاقة',
            expiry: 'تاريخ الانتهاء (MM/YY)',
            cvv: 'CVV',
            customerInfo: 'معلومات العميل',
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            branch: 'اختر الفرع',
            orderSummary: 'ملخص الطلب',
            total: 'الإجمالي',
            submitOrder: 'إرسال الطلب',
            proceedToPayment: 'المتابعة إلى الدفع',
            edit: 'تعديل',
            confirmOrder: 'تأكيد الطلب',
            confirmPayment: 'تأكيد الدفع',
            success: 'تمت عملية الدفع بنجاح!',
            successInBranch: 'تم تسجيل طلبك!',
            successDesc: 'شكرًا لطلبك. ستتلقى تأكيدًا قريبًا.',
            close: 'إغلاق',
            errors: {
                required: 'هذا الحقل مطلوب',
                email: 'تنسيق البريد الإلكتروني غير صالح',
                phone: 'رقم الهاتف غير صالح (8-15 رقمًا)',
                name: 'الاسم يجب أن يكون حرفين على الأقل',
                cardHolder: 'اسم حامل البطاقة يجب أن يكون حرفين على الأقل',
                cardNumber: 'رقم البطاقة يجب أن يكون ١٦ رقمًا',
                expiry: 'تاريخ الانتهاء غير صالح (MM/YY)',
                cvv: 'يجب أن يكون CVV مكونًا من ٣ أرقام',
            },
        },
    };

    const t = isRTL ? translations.ar : translations.en;

    const [formData, setFormData] = useState({
        meatType: '',
        cutType: '',
        specialInstructions: '',
        spice: '',
        udhiyaTiming: '',
        delivery: false,
        deliveryAddress: '',
        paymentMethod: '',
        branch: '',
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [modalState, setModalState] = useState(null); // null, 'order', 'payment', 'success'
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateOrderForm = () => {
        const newErrors = {};
        if (!formData.meatType) newErrors.meatType = t.errors.required;
        if (!formData.cutType) newErrors.cutType = t.errors.required;
        if (!formData.spice) newErrors.spice = t.errors.required;
        if (!formData.udhiyaTiming) newErrors.udhiyaTiming = t.errors.required;
        if (formData.delivery && !formData.deliveryAddress)
            newErrors.deliveryAddress = t.errors.required;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePaymentForm = () => {
        const newErrors = {};
        if (!formData.paymentMethod) newErrors.paymentMethod = t.errors.required;
        if (!formData.name) newErrors.name = t.errors.required;
        else if (formData.name.length < 2) newErrors.name = t.errors.name;
        if (!formData.email) newErrors.email = t.errors.required;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = t.errors.email;
        if (!formData.phone) newErrors.phone = t.errors.required;
        else if (!/^\+?\d{8,15}$/.test(formData.phone)) newErrors.phone = t.errors.phone;
        if (formData.paymentMethod === 'inBranch') {
            if (!formData.branch) newErrors.branch = t.errors.required;
        } else if (formData.paymentMethod === 'online') {
            if (!formData.cardHolder) newErrors.cardHolder = t.errors.required;
            else if (formData.cardHolder.length < 2) newErrors.cardHolder = t.errors.cardHolder;
            if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber))
                newErrors.cardNumber = t.errors.cardNumber;
            if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry))
                newErrors.expiry = t.errors.expiry;
            if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) newErrors.cvv = t.errors.cvv;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        if (validateOrderForm()) {
            setModalState('order');
        }
    };

    const handleProceedToPayment = () => {
        setModalState('payment');
    };

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        if (validatePaymentForm()) {
            console.log(formData.paymentMethod === 'online' ? 'Processing Visa Card payment' : 'Recording in-branch order', formData);
            setPaymentSuccess(formData.paymentMethod === 'online');
            setModalState('success');
        }
    };

    const calculateTotal = () => {
        const meatPrice = t.meatOptions.find((m) => m.value === formData.meatType)?.price || 0;
        const deliveryFee = formData.delivery ? 2 : 0;
        return (meatPrice + deliveryFee).toFixed(2);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    return (
        <div className="min-h-screen bg-[#f9e9d8] flex flex-col" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* هدر اختصاصی */}
            <header
                className="relative bg-cover bg-center h-[80vh]"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)` }}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `url(https://www.transparenttextures.com/patterns/arabesque.png)` }}
                ></div>
                <img
                    src="https://img.icons8.com/ios-filled/50/ffffff/crescent-moon.png"
                    alt="Crescent Moon"
                    className="absolute top-5 right-5 w-12 opacity-30"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center">
                    <div className="px-4 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']">{t.title}</h1>
                        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">{t.subtitle}</p>
                        <motion.button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 rounded-full shadow-md mb-4"
                            style={{ backgroundColor: '#d4a017', color: '#FFFFFF' }}
                            whileHover={{ scale: 1.05, backgroundColor: '#b8860b' }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={isRTL ? 'Switch to English' : 'Switch to Arabic'}
                        >
                            {isRTL ? 'EN' : 'AR'}
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* نحوه خرید */}
            <motion.section
                className="py-12 px-4 bg-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#8b1e2d] mb-8 font-['Playfair_Display']">
                        {t.howToBuy}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {t.locations.map((loc, index) => (
                            <motion.div
                                key={index}
                                className="relative bg-white border-2 border-[#d4a017] rounded-lg shadow-md"
                                variants={cardVariants}
                                whileHover={{ scale: 1.05, boxShadow: '0_8px_25px_rgba(0,0,0,0.15)' }}
                            >
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: `url(https://www.transparenttextures.com/patterns/arabesque.png)` }}
                                ></div>
                                <img
                                    src="https://img.icons8.com/ios-filled/30/8b1e2d/crescent-moon.png"
                                    alt="Crescent Moon"
                                    className="absolute top-2 right-2 w-6 opacity-30"
                                />
                                <div className="bg-[#8b1e2d] text-white text-center p-4 rounded-t-lg">
                                    <h3 className="text-xl font-semibold">{loc.name}</h3>
                                </div>
                                <div className="h-36 flex items-center justify-center bg-gray-200">
                                    <FaMapMarkerAlt className="text-[#8b1e2d] text-6xl" />
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 mb-2">
                                        <strong>{isRTL ? 'العنوان' : 'Address'}:</strong> {loc.address}
                                    </p>
                                    <p className="text-gray-700 mb-2">
                                        <strong>{isRTL ? 'الاتصال' : 'Contact'}:</strong> {loc.contact}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>{isRTL ? 'ساعات العمل' : 'Hours'}:</strong> {loc.hours}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* فرم سفارشی‌سازی */}
            <motion.section
                className="py-12 px-4 bg-[#f9e9d8]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-6xl mx-auto">
                    <form onSubmit={handleSubmitOrder} className="bg-white rounded-lg shadow-md p-6">
                        {/* نوع گوشت */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-[#8b1e2d] mb-4 font-['Playfair_Display']">
                                {t.meatType}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {t.meatOptions.map((meat) => (
                                    <motion.label
                                        key={meat.value}
                                        className={`relative bg-white border-2 rounded-lg shadow-md cursor-pointer ${formData.meatType === meat.value ? 'border-[#d4a017]' : 'border-gray-300'
                                            }`}
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-10"
                                            style={{ backgroundImage: `url(https://www.transparenttextures.com/patterns/arabesque.png)` }}
                                        ></div>
                                        <img
                                            src="https://img.icons8.com/ios-filled/30/8b1e2d/crescent-moon.png"
                                            alt="Crescent Moon"
                                            className="absolute top-2 right-2 w-6 opacity-30"
                                        />
                                        <div className="bg-[#8b1e2d] text-white text-center p-3 rounded-t-lg">
                                            <h4 className="text-lg font-semibold">{meat.label}</h4>
                                        </div>
                                        <div className="h-40 flex items-center justify-center bg-gray-200">
                                            <FaDrumstickBite className="text-6xl" style={{ color: meat.color }} />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 mb-2">{meat.desc}</p>
                                            <p className="text-[#d4a017] font-bold">{meat.price} OMR/kg</p>
                                            <input
                                                type="radio"
                                                name="meatType"
                                                value={meat.value}
                                                onChange={handleInputChange}
                                                className="mt-2"
                                                required
                                            />
                                        </div>
                                    </motion.label>
                                ))}
                            </div>
                            {errors.meatType && <p className="text-red-500 text-xs mt-2">{errors.meatType}</p>}
                        </div>

                        {/* سبک برش */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-[#8b1e2d] mb-4 font-['Playfair_Display']">
                                {t.cutType}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {t.cutOptions.map((cut) => (
                                    <motion.label
                                        key={cut.value}
                                        className={`relative bg-white border-2 rounded-lg shadow-md cursor-pointer ${formData.cutType === cut.value ? 'border-[#d4a017]' : 'border-gray-300'
                                            }`}
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-10"
                                            style={{ backgroundImage: `url(https://www.transparenttextures.com/patterns/arabesque.png)` }}
                                        ></div>
                                        <img
                                            src="https://img.icons8.com/ios-filled/30/8b1e2d/crescent-moon.png"
                                            alt="Crescent Moon"
                                            className="absolute top-2 right-2 w-6 opacity-30"
                                        />
                                        <div className="bg-[#8b1e2d] text-white text-center p-3 rounded-t-lg">
                                            <h4 className="text-lg font-semibold">{cut.label}</h4>
                                        </div>
                                        <div className="h-40 flex items-center justify-center bg-gray-200">
                                            <FaCut className="text-6xl" style={{ color: cut.color }} />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700">{cut.desc}</p>
                                            <input
                                                type="radio"
                                                name="cutType"
                                                value={cut.value}
                                                onChange={handleInputChange}
                                                className="mt-2"
                                                required
                                            />
                                        </div>
                                    </motion.label>
                                ))}
                            </div>
                            {errors.cutType && <p className="text-red-500 text-xs mt-2">{errors.cutType}</p>}
                        </div>

                        {/* دستورالعمل‌های خاص */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-2 text-[#8b1e2d]">{t.specialInstructions}</label>
                            <textarea
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleInputChange}
                                placeholder={t.specialInstructionsPlaceholder}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="4"
                            />
                        </div>

                        {/* ادویه */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-[#8b1e2d] mb-4 font-['Playfair_Display']">
                                {t.spice}
                            </h3>
                            <div className="flex gap-4">
                                <label>
                                    <input
                                        type="radio"
                                        name="spice"
                                        value="spiced"
                                        onChange={handleInputChange}
                                        className="mr-2"
                                        required
                                    />
                                    {t.spiceOptions.spiced}
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="spice"
                                        value="unspiced"
                                        onChange={handleInputChange}
                                        className="mr-2"
                                        required
                                    />
                                    {t.spiceOptions.unspiced}
                                </label>
                            </div>
                            {formData.spice === 'spiced' && (
                                <p className="text-xs text-gray-600 mt-2">{t.spiceOptions.spiceDesc}</p>
                            )}
                            {errors.spice && <p className="text-red-500 text-xs mt-2">{errors.spice}</p>}
                        </div>

                        {/* زمان‌بندی عیدیه */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-[#8b1e2d] mb-4 font-['Playfair_Display']">
                                {t.udhiyaTiming}
                            </h3>
                            <select
                                name="udhiyaTiming"
                                value={formData.udhiyaTiming}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">{isRTL ? 'اختر التوقيت' : 'Select Timing'}</option>
                                {t.timingOptions.map((time) => (
                                    <option key={time.value} value={time.value}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                            {errors.udhiyaTiming && <p className="text-red-500 text-xs mt-2">{errors.udhiyaTiming}</p>}
                        </div>

                        {/* تحویل */}
                        <div className="mb-8">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="delivery"
                                    checked={formData.delivery}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className="text-[#8b1e2d]">{t.delivery}</span>
                            </label>
                            {formData.delivery && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2 text-[#8b1e2d]">
                                        {t.deliveryAddress}
                                    </label>
                                    <input
                                        type="text"
                                        name="deliveryAddress"
                                        value={formData.deliveryAddress}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required={formData.delivery}
                                    />
                                    {errors.deliveryAddress && (
                                        <p className="text-red-500 text-xs mt-2">{errors.deliveryAddress}</p>
                                    )}
                                    <p className="text-xs text-gray-600 mt-2">
                                        {isRTL ? 'رسوم التوصيل: ٢ ريال عماني' : 'Delivery Fee: 2 OMR'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* دکمه ارسال سفارش */}
                        <motion.button
                            type="submit"
                            className="px-6 py-2 rounded-lg font-semibold"
                            style={{ backgroundColor: '#d4a017', color: '#FFFFFF' }}
                            whileHover={{ scale: 1.05, backgroundColor: '#b8860b' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t.submitOrder}
                        </motion.button>
                    </form>
                </div>
            </motion.section>

            {/* مودال‌ها */}
            <AnimatePresence>
                {modalState && (
                    <Modal
                        isOpen={!!modalState}
                        onRequestClose={() => setModalState(null)}
                        className="max-w-md w-full bg-white rounded-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] max-h-[80vh] overflow-y-auto mt-16 z-30"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
                    >
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-[#8b1e2d] font-['Playfair_Display']">
                                    {modalState === 'order'
                                        ? t.confirmOrder
                                        : modalState === 'payment'
                                            ? t.payment
                                            : paymentSuccess
                                                ? t.success
                                                : t.successInBranch}
                                </h3>
                                <button onClick={() => setModalState(null)}>
                                    <FaTimes className="text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>

                            {modalState === 'order' && (
                                <div>
                                    <h4 className="text-base font-medium text-[#d4a017] mb-2">{t.orderSummary}</h4>
                                    <p>
                                        <strong>{t.meatType}:</strong>{' '}
                                        {t.meatOptions.find((m) => m.value === formData.meatType)?.label || '-'}
                                    </p>
                                    <p>
                                        <strong>{t.cutType}:</strong>{' '}
                                        {t.cutOptions.find((c) => c.value === formData.cutType)?.label || '-'}
                                    </p>
                                    <p>
                                        <strong>{t.specialInstructions}:</strong>{' '}
                                        {formData.specialInstructions || (isRTL ? 'لا يوجد' : 'None')}
                                    </p>
                                    <p>
                                        <strong>{t.spice}:</strong>{' '}
                                        {formData.spice ? t.spiceOptions[formData.spice] : '-'}
                                    </p>
                                    <p>
                                        <strong>{t.udhiyaTiming}:</strong>{' '}
                                        {t.timingOptions.find((t) => t.value === formData.udhiyaTiming)?.label || '-'}
                                    </p>
                                    <p>
                                        <strong>{t.delivery}:</strong>{' '}
                                        {formData.delivery ? formData.deliveryAddress || '-' : isRTL ? 'لا' : 'No'}
                                    </p>
                                    <p className="mt-2">
                                        <strong>{t.total}:</strong> {calculateTotal()} OMR
                                    </p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <motion.button
                                            onClick={() => setModalState(null)}
                                            className="px-4 py-2 rounded-lg font-semibold"
                                            style={{ backgroundColor: '#8b1e2d', color: '#FFFFFF' }}
                                            whileHover={{ scale: 1.05, backgroundColor: '#6b1722' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t.edit}
                                        </motion.button>
                                        <motion.button
                                            onClick={handleProceedToPayment}
                                            className="px-4 py-2 rounded-lg font-semibold"
                                            style={{ backgroundColor: '#d4a017', color: '#FFFFFF' }}
                                            whileHover={{ scale: 1.05, backgroundColor: '#b8860b' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t.proceedToPayment}
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            {modalState === 'payment' && (
                                <form onSubmit={handleSubmitPayment}>
                                    {/* اطلاعات مشتری */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium text-[#d4a017] mb-2">{t.customerInfo}</h4>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">{t.name}</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">{t.email}</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">{t.phone}</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* روش پرداخت */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium text-[#d4a017] mb-2">{t.payment}</h4>
                                        <div className="flex gap-4 mb-4">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                    required
                                                />
                                                {t.paymentOptions.online}
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="inBranch"
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                    required
                                                />
                                                {t.paymentOptions.inBranch}
                                            </label>
                                        </div>
                                        {errors.paymentMethod && (
                                            <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
                                        )}
                                        {formData.paymentMethod === 'inBranch' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">
                                                    {t.branch}
                                                </label>
                                                <select
                                                    name="branch"
                                                    value={formData.branch}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                >
                                                    <option value="">{isRTL ? 'اختر الفرع' : 'Select Branch'}</option>
                                                    {t.locations.map((loc) => (
                                                        <option key={loc.name} value={loc.name}>
                                                            {loc.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                                            </div>
                                        )}
                                        {formData.paymentMethod === 'online' && (
                                            <div>
                                                <h4 className="text-base font-medium text-[#d4a017] mb-2">{t.cardDetails}</h4>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FaCreditCard className="text-[#8b1e2d]" />
                                                    <span className="text-sm font-medium">
                                                        {isRTL ? 'فيزا كارد' : 'Visa Card'}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">
                                                        {t.cardHolder}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardHolder"
                                                        value={formData.cardHolder}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                    {errors.cardHolder && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">
                                                        {t.cardNumber}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        required
                                                        maxLength="16"
                                                    />
                                                    {errors.cardNumber && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">
                                                            {t.expiry}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="expiry"
                                                            value={formData.expiry}
                                                            onChange={handleInputChange}
                                                            placeholder="MM/YY"
                                                            className="w-full p-2 border border-gray-300 rounded-md"
                                                            required
                                                            maxLength="5"
                                                        />
                                                        {errors.expiry && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium mb-1 text-[#8b1e2d]">
                                                            {t.cvv}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            value={formData.cvv}
                                                            onChange={handleInputChange}
                                                            placeholder="123"
                                                            className="w-full p-2 border border-gray-300 rounded-md"
                                                            required
                                                            maxLength="3"
                                                        />
                                                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg font-semibold"
                                        style={{ backgroundColor: '#d4a017', color: '#FFFFFF' }}
                                        whileHover={{ scale: 1.05, backgroundColor: '#b8860b' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t.confirmPayment}
                                    </motion.button>
                                </form>
                            )}

                            {modalState === 'success' && (
                                <div className="text-center">
                                    <FaStar className="text-yellow-400 text-3xl mx-auto mb-4" />
                                    <p className="text-lg font-semibold text-[#d4a017]">
                                        {paymentSuccess ? t.success : t.successInBranch}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">{t.successDesc}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {isRTL ? 'رقم الطلب: ORDER-' : 'Order Number: ORDER-'}
                                        {Math.floor(Math.random() * 10000)}
                                    </p>
                                    {paymentSuccess ? (
                                        <p className="text-sm text-gray-600 mt-2">
                                            {isRTL
                                                ? `تم الدفع باستخدام البطاقة: **** **** **** ${formData.cardNumber.slice(-4)}`
                                                : `Paid with card: **** **** **** ${formData.cardNumber.slice(-4)}`}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600 mt-2">
                                            {isRTL
                                                ? `يرجى الدفع في الفرع: ${formData.branch}`
                                                : `Please pay at branch: ${formData.branch}`}
                                        </p>
                                    )}
                                    <motion.button
                                        onClick={() => {
                                            setModalState(null);
                                            setFormData({
                                                meatType: '',
                                                cutType: '',
                                                specialInstructions: '',
                                                spice: '',
                                                udhiyaTiming: '',
                                                delivery: false,
                                                deliveryAddress: '',
                                                paymentMethod: '',
                                                branch: '',
                                                cardHolder: '',
                                                cardNumber: '',
                                                expiry: '',
                                                cvv: '',
                                                name: '',
                                                email: '',
                                                phone: '',
                                            });
                                        }}
                                        className="mt-4 px-6 py-2 rounded-lg font-semibold"
                                        style={{ backgroundColor: '#8b1e2d', color: '#FFFFFF' }}
                                        whileHover={{ scale: 1.05, backgroundColor: '#6b1722' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t.close}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* فوتر اختصاصی */}
            <footer className="bg-[#8b1e2d] py-8 px-4 text-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <img src="/hypmx.png" alt="Hyper Max Logo" className="h-10" />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="mb-2">Hyper Max, Muscat, Oman</p>
                        <p>{isRTL ? 'الاتصال: +968 1234 5678 | info@hypermax.om' : 'Contact: +968 1234 5678 | info@hypermax.om'}</p>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#">
                            <img src="https://img.icons8.com/ios-filled/30/ffffff/facebook-new.png" alt="Facebook" />
                        </a>
                        <a href="#">
                            <img src="https://img.icons8.com/ios-filled/30/ffffff/instagram-new.png" alt="Instagram" />
                        </a>
                        <a href="#">
                            <img src="https://img.icons8.com/ios-filled/30/ffffff/twitter.png" alt="Twitter" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default EidAlAdha;