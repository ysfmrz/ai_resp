import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { FaStar, FaTimes, FaHeart } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // برای دسترسی‌پذیری

const Feedback = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({
        rating: 0,
        comment: '',
        email: '',
    });
    const [preview, setPreview] = useState(false);

    const questions = [
        {
            id: 1,
            text: isRTL ? 'كيف يمكننا تحسين خدماتنا؟' : 'How can we improve our services?',
        },
        {
            id: 2,
            text: isRTL ? 'كيف تقيم جودة منتجات هايبر ماكس؟' : 'How would you rate the quality of Hyper Max products?',
        },
        {
            id: 3,
            text: isRTL ? 'كيف كانت تجربة التسوق عبر الإنترنت؟' : 'How was your online shopping experience?',
        },
        {
            id: 4,
            text: isRTL ? 'إلى أي مدى ساعدك موظفو المتجر؟' : 'How helpful were our store staff?',
        },
        {
            id: 5,
            text: isRTL ? 'هل كانت عروضنا جذابة بالنسبة لك؟' : 'Were our offers attractive to you?',
        },
        {
            id: 6,
            text: isRTL ? 'ما مدى رضاك عن نظافة وترتيب المتجر؟' : 'How satisfied are you with the store’s cleanliness and organization?',
        },
        {
            id: 7,
            text: isRTL ? 'كيف كانت سرعة خدماتنا (مثل التوصيل)؟' : 'How was the speed of our services (e.g., delivery)?',
        },
        {
            id: 8,
            text: isRTL ? 'هل موقعنا الإلكتروني سهل الاستخدام؟' : 'Is our website user-friendly?',
        },
        {
            id: 9,
            text: isRTL ? 'ما هي فئة المنتجات المفضلة لديك؟' : 'Which product category do you like the most?',
        },
        {
            id: 10,
            text: isRTL ? 'هل لديك اقتراح أو شكوى؟' : 'Do you have any suggestions or complaints?',
        },
    ];

    const openModal = (question) => {
        setSelectedQuestion(question);
        setFormData({ rating: 0, comment: '', email: '' });
        setPreview(false);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedQuestion(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRating = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (preview) {
            console.log('Feedback Submitted:', {
                question: selectedQuestion.text,
                ...formData,
            });
            alert(isRTL ? 'تم إرسال الملاحظات بنجاح!' : 'Feedback submitted successfully!');
            closeModal();
        } else {
            setPreview(true);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        <section className="py-12 px-4 flex flex-col items-center min-h-screen">
            <motion.div
                className="max-w-7xl w-full text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ color: '#005A9E' }}
                >
                    {isRTL ? 'ملاحظاتكم' : 'Your Feedback'}
                </h2>
                <p
                    className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                    {isRTL
                        ? 'شاركنا آراءك لتحسين تجربتك مع هايبر ماكس!'
                        : 'Share your feedback to help us improve your Hyper Max experience!'}
                </p>
            </motion.div>

            <motion.div
                className="max-w-7xl w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions.map((question) => (
                        <motion.div
                            key={question.id}
                            className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center cursor-pointer"
                            variants={cardVariants}
                            whileHover={{ scale: 1.05, boxShadow: '0_8px_25px_rgba(0,0,0,0.15)' }}
                            onClick={() => openModal(question)}
                        >
                            <div className="text-3xl mb-4" style={{ color: '#A5C93D' }}>
                                <FaHeart />
                            </div>
                            <h3
                                className="text-lg font-semibold text-center"
                                style={{ color: '#005A9E' }}
                            >
                                {question.text}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence>
                {modalIsOpen && (
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        className="max-w-md w-full bg-white rounded-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] max-h-[80vh] overflow-y-auto mt-16 z-30"
                        overlayClassName="absolute inset-0 bg-black bg-opacity-30"
                        style={{
                            content: {
                                background: 'linear-gradient(to bottom, #F5F7FA, #FFFFFF)',
                                position: 'absolute',
                                top: '0',
                            },
                        }}
                        preventScroll={false}
                    >
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                            <div className="flex justify-between items-center mb-4">
                                <h3
                                    className="text-xl font-semibold"
                                    style={{ color: '#005A9E' }}
                                >
                                    {selectedQuestion.text}
                                </h3>
                                <button onClick={closeModal}>
                                    <FaTimes className="text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>
                            {preview ? (
                                <div className="mb-4">
                                    <h4
                                        className="text-base font-medium mb-2"
                                        style={{ color: '#A5C93D' }}
                                    >
                                        {isRTL ? 'معاينة الملاحظات' : 'Feedback Preview'}
                                    </h4>
                                    <p>
                                        <strong>{isRTL ? 'التقييم:' : 'Rating:'}</strong> {formData.rating} / 5
                                    </p>
                                    <p>
                                        <strong>{isRTL ? 'التعليق:' : 'Comment:'}</strong> {formData.comment}
                                    </p>
                                    {formData.email && (
                                        <p>
                                            <strong>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong> {formData.email}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: '#005A9E' }}
                                        >
                                            {isRTL ? 'التقييم (1-5)' : 'Rating (1-5)'}
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`cursor-pointer ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    onClick={() => handleRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: '#005A9E' }}
                                        >
                                            {isRTL ? 'التعليق' : 'Comment'}
                                        </label>
                                        <textarea
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md"
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: '#005A9E' }}
                                        >
                                            {isRTL ? 'البريد الإلكتروني (اختياري)' : 'Your Email (Optional)'}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 space-x-reverse">
                                        <motion.button
                                            type="submit"
                                            className="px-6 py-2 rounded-full font-semibold"
                                            style={{ backgroundColor: '#A5C93D', color: '#FFFFFF' }}
                                            whileHover={{ scale: 1.05, backgroundColor: '#8BB32E' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {preview
                                                ? isRTL
                                                    ? 'إرسال'
                                                    : 'Submit'
                                                : isRTL
                                                    ? 'معاينة'
                                                    : 'Preview'}
                                        </motion.button>
                                        {preview && (
                                            <motion.button
                                                onClick={() => setPreview(false)}
                                                className="px-6 py-2 rounded-full font-semibold"
                                                style={{ backgroundColor: '#005A9E', color: '#FFFFFF' }}
                                                whileHover={{ scale: 1.05, backgroundColor: '#004682' }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {isRTL ? 'تعديل' : 'Edit'}
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Feedback;