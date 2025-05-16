import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { FaCamera, FaBarcode, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

Modal.setAppElement('#root'); // برای دسترسی‌پذیری

const SuggestProduct = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        barcode: '',
        photo: null,
        photoName: '',
        category: '',
        email: '',
    });
    const [preview, setPreview] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const options = [
        { id: 'scan', label: isRTL ? 'مسح الباركود' : 'Scan Barcode', icon: <FaBarcode /> },
        { id: 'photo', label: isRTL ? 'تحميل/التقاط صورة' : 'Upload/Take Photo', icon: <FaCamera /> },
    ];

    const categories = [
        { value: 'electronics', label: isRTL ? 'إلكترونيات' : 'Electronics' },
        { value: 'fashion', label: isRTL ? 'أزياء' : 'Fashion' },
        { value: 'grocery', label: isRTL ? 'بقالة' : 'Grocery' },
        { value: 'appliances', label: isRTL ? 'أجهزة منزلية' : 'Appliances' },
        { value: 'other', label: isRTL ? 'أخرى' : 'Other' },
    ];

    const generateRandomName = () => {
        return `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
    };

    const openModal = (optionId) => {
        setSelectedOption(optionId);
        setFormData({
            name: '',
            description: '',
            barcode: optionId === 'scan' ? '' : '',
            photo: null,
            photoName: '',
            category: '',
            email: '',
        });
        setPreview(false);
        setIsScanning(optionId === 'scan');
        setPhotoPreview(null);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedOption(null);
        setIsScanning(false);
        setPhotoPreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const randomName = generateRandomName();
            setFormData((prev) => ({ ...prev, photo: file, photoName: randomName }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (preview) {
            console.log('Suggested Product:', formData);
            alert(isRTL ? 'تم إرسال الاقتراح بنجاح!' : 'Suggestion submitted successfully!');
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
                    {isRTL ? 'اقتراح منتج' : 'Suggest a Product'}
                </h2>
                <p
                    className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                    {isRTL
                        ? 'شاركنا اقتراحاتك لمنتجات جديدة نضيفها إلى هايبر ماكس!'
                        : 'Share your suggestions for new products to add to Hyper Max!'}
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
                    {options.map((option) => (
                        <motion.div
                            key={option.id}
                            className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center cursor-pointer"
                            variants={cardVariants}
                            whileHover={{ scale: 1.05, boxShadow: '0_8px_25px_rgba(0,0,0,0.15)' }}
                            onClick={() => openModal(option.id)}
                        >
                            <div className="text-3xl mb-4" style={{ color: '#A5C93D' }}>
                                {option.icon}
                            </div>
                            <h3
                                className="text-lg font-semibold"
                                style={{ color: '#005A9E' }}
                            >
                                {option.label}
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
                                    {isRTL ? 'اقتراح منتج جديد' : 'Suggest a New Product'}
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
                                        {isRTL ? 'معاينة الاقتراح' : 'Suggestion Preview'}
                                    </h4>
                                    <p>
                                        <strong>{isRTL ? 'اسم المنتج:' : 'Product Name:'}</strong> {formData.name}
                                    </p>
                                    <p>
                                        <strong>{isRTL ? 'الوصف:' : 'Description:'}</strong> {formData.description}
                                    </p>
                                    {formData.barcode && (
                                        <p>
                                            <strong>{isRTL ? 'الباركود:' : 'Barcode:'}</strong> {formData.barcode}
                                        </p>
                                    )}
                                    {formData.photo && (
                                        <div>
                                            <p>
                                                <strong>{isRTL ? 'اسم الصورة:' : 'Photo Name:'}</strong> {formData.photoName}
                                            </p>
                                            <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover mt-2 rounded-md" />
                                        </div>
                                    )}
                                    <p>
                                        <strong>{isRTL ? 'الفئة:' : 'Category:'}</strong>{' '}
                                        {categories.find((cat) => cat.value === formData.category)?.label || ''}
                                    </p>
                                    <p>
                                        <strong>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong> {formData.email}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {selectedOption === 'scan' && isScanning ? (
                                        <div className="mb-4">
                                            <BarcodeScannerComponent
                                                onUpdate={handleBarcodeScan}
                                                width="100%"
                                                height={200}
                                            />
                                            <button
                                                onClick={() => setIsScanning(false)}
                                                className="mt-2 px-4 py-1 rounded-full"
                                                style={{ backgroundColor: '#005A9E', color: '#FFFFFF' }}
                                            >
                                                {isRTL ? 'إيقاف المسح' : 'Stop Scanning'}
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <label
                                                    className="block text-sm font-medium mb-1"
                                                    style={{ color: '#005A9E' }}
                                                >
                                                    {isRTL ? 'اسم المنتج' : 'Product Name'}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    className="block text-sm font-medium mb-1"
                                                    style={{ color: '#005A9E' }}
                                                >
                                                    {isRTL ? 'الوصف' : 'Description'}
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded-md"
                                                    rows="4"
                                                    required
                                                />
                                            </div>
                                            {selectedOption === 'scan' && (
                                                <div className="mb-4">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: '#005A9E' }}
                                                    >
                                                        {isRTL ? 'الباركود' : 'Barcode'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="barcode"
                                                        value={formData.barcode}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border rounded-md"
                                                        readOnly
                                                    />
                                                </div>
                                            )}
                                            {selectedOption === 'photo' && (
                                                <div className="mb-4">
                                                    <label
                                                        className="block text-sm font-medium mb-1"
                                                        style={{ color: '#005A9E' }}
                                                    >
                                                        {isRTL ? 'صورة المنتج (اختياري)' : 'Product Photo (Optional)'}
                                                    </label>
                                                    <div className="flex gap-4">
                                                        <label className="inline-block px-4 py-2 rounded-full cursor-pointer" style={{ backgroundColor: '#A5C93D', color: '#FFFFFF' }}>
                                                            {isRTL ? 'اختيار ملف' : 'Choose File'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        <label className="inline-block px-4 py-2 rounded-full cursor-pointer" style={{ backgroundColor: '#005A9E', color: '#FFFFFF' }}>
                                                            {isRTL ? 'التقاط صورة' : 'Take Photo'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                capture="environment"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                    {formData.photo && (
                                                        <div className="mt-2">
                                                            <p>
                                                                <strong>{isRTL ? 'اسم الصورة:' : 'Photo Name:'}</strong> {formData.photoName}
                                                            </p>
                                                            <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover mt-2 rounded-md" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mb-4">
                                                <label
                                                    className="block text-sm font-medium mb-1"
                                                    style={{ color: '#005A9E' }}
                                                >
                                                    {isRTL ? 'الفئة' : 'Category'}
                                                </label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">{isRTL ? 'اختر فئة' : 'Select Category'}</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    className="block text-sm font-medium mb-1"
                                                    style={{ color: '#005A9E' }}
                                                >
                                                    {isRTL ? 'البريد الإلكتروني' : 'Your Email'}
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
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

export default SuggestProduct;