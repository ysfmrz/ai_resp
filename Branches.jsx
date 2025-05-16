import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const Branches = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;
    const [branches, setBranches] = useState([]);
    const [visibleOffers, setVisibleOffers] = useState({}); // تعداد آفرهای قابل‌نمایش برای هر شعبه

    useEffect(() => {
        const loadBranches = async () => {
            const branchList = [
                {
                    id: 1,
                    name: isRTL ? 'الخوير' : 'Al Khuwair',
                    address: isRTL
                        ? 'شارع الخوير، بالقرب من هايبرماركت KM، مسقط'
                        : 'Al Khuwair Street, near KM Hypermarket, Muscat',
                    mapLink: 'https://maps.google.com/?q=Al+Khuwair,+Muscat',
                    isNew: true,
                    pdfs: [
                        { name: isRTL ? 'كتالوج عام' : 'General Catalog', url: '/offers/al-khuwair/general-catalog.pdf' },
                        { name: isRTL ? 'الإلكترونيات' : 'Electronics', url: '/offers/al-khuwair/electronics.pdf' },
                        { name: isRTL ? 'الأزياء' : 'Fashion', url: '/offers/al-khuwair/fashion.pdf' },
                        { name: isRTL ? 'الأجهزة المنزلية' : 'Home Appliances', url: '/offers/al-khuwair/home-appliances.pdf' },
                        { name: isRTL ? 'عروض البقالة' : 'Grocery Offers', url: '/offers/al-khuwair/grocery-offers.pdf' },
                    ],
                },
                {
                    id: 2,
                    name: isRTL ? 'سيب' : 'Seeb',
                    address: isRTL
                        ? 'شارع سيب، بالقرب من لولو هايبرماركت، مسقط'
                        : 'Seeb Street, near Lulu Hypermarket, Muscat',
                    mapLink: 'https://maps.google.com/?q=Seeb,+Muscat',
                    isNew: true,
                    pdfs: [
                        { name: isRTL ? 'كتالوج المنتجات' : 'Product Catalog', url: '/offers/seeb/product-catalog.pdf' },
                        { name: isRTL ? 'التكنولوجيا' : 'Technology', url: '/offers/seeb/technology.pdf' },
                        { name: isRTL ? 'الملابس' : 'Clothing', url: '/offers/seeb/clothing.pdf' },
                        { name: isRTL ? 'الأثاث' : 'Furniture', url: '/offers/seeb/furniture.pdf' },
                        { name: isRTL ? 'عروض يومية' : 'Daily Offers', url: '/offers/seeb/daily-offers.pdf' },
                    ],
                },
                {
                    id: 3,
                    name: isRTL ? 'غبره' : 'Ghoubra',
                    address: isRTL
                        ? 'شارع المرفعة، بالقرب من عمان أفنيوز مول، مسقط'
                        : 'Al Marafah Street, near Oman Avenues Mall, Muscat',
                    mapLink: 'https://maps.google.com/?q=Ghoubra,+Muscat',
                    isNew: false,
                    pdfs: [
                        { name: isRTL ? 'كتالوج رئيسي' : 'Main Catalog', url: '/offers/ghoubra/main-catalog.pdf' },
                        { name: isRTL ? 'الأجهزة الذكية' : 'Smart Devices', url: '/offers/ghoubra/smart-devices.pdf' },
                        { name: isRTL ? 'الأناقة' : 'Style', url: '/offers/ghoubra/style.pdf' },
                        { name: isRTL ? 'ديكور المنزل' : 'Home Decor', url: '/offers/ghoubra/home-decor.pdf' },
                        { name: isRTL ? 'عروض خاصة' : 'Special Offers', url: '/offers/ghoubra/special-offers.pdf' },
                    ],
                },
                {
                    id: 4,
                    name: isRTL ? 'روي' : 'Ruwi',
                    address: isRTL
                        ? 'سوق روي، بالقرب من لولو هايبرماركت، مسقط'
                        : 'Ruwi Souq, near Lulu Hypermarket, Muscat',
                    mapLink: 'https://maps.google.com/?q=Ruwi,+Muscat',
                    isNew: false,
                    pdfs: [
                        { name: isRTL ? 'كتالوج شامل' : 'Full Catalog', url: '/offers/ruwi/full-catalog.pdf' },
                        { name: isRTL ? 'الإلكترونيات المتقدمة' : 'Advanced Electronics', url: '/offers/ruwi/advanced-electronics.pdf' },
                        { name: isRTL ? 'الموضة' : 'Fashion', url: '/offers/ruwi/fashion.pdf' },
                        { name: isRTL ? 'الأجهزة الكهربائية' : 'Appliances', url: '/offers/ruwi/appliances.pdf' },
                        { name: isRTL ? 'عروض الأسبوع' : 'Weekly Offers', url: '/offers/ruwi/weekly-offers.pdf' },
                    ],
                },
                {
                    id: 5,
                    name: isRTL ? 'موالح' : 'Mawaleh',
                    address: isRTL
                        ? 'شارع البركات، بالقرب من نيستو هايبرماركت، مسقط'
                        : 'Al Barakat Street, near Nesto Hypermarket, Muscat',
                    mapLink: 'https://maps.google.com/?q=Mawaleh,+Muscat',
                    isNew: false,
                    pdfs: [
                        { name: isRTL ? 'كتالوج العروض' : 'Offers Catalog', url: '/offers/mawaleh/offers-catalog.pdf' },
                        { name: isRTL ? 'الأدوات التقنية' : 'Tech Gadgets', url: '/offers/mawaleh/tech-gadgets.pdf' },
                        { name: isRTL ? 'الأزياء العصرية' : 'Trendy Fashion', url: '/offers/mawaleh/trendy-fashion.pdf' },
                        { name: isRTL ? 'مستلزمات المنزل' : 'Home Essentials', url: '/offers/mawaleh/home-essentials.pdf' },
                        { name: isRTL ? 'عروض السوبرماركت' : 'Supermarket Offers', url: '/offers/mawaleh/supermarket-offers.pdf' },
                    ],
                },
            ];

            // تنظیم تعداد آفرهای اولیه (4 تا)
            const initialVisibleOffers = {};
            branchList.forEach((branch) => {
                initialVisibleOffers[branch.id] = 4;
            });

            // چک کردن وجود PDFها
            for (const branch of branchList) {
                for (const pdf of branch.pdfs) {
                    try {
                        const response = await fetch(pdf.url);
                        if (!response.ok) {
                            console.error(`PDF file not found: ${pdf.url}`);
                        }
                    } catch (error) {
                        console.error(`Error checking PDF file ${pdf.url}:`, error);
                    }
                }
            }

            setBranches(branchList);
            setVisibleOffers(initialVisibleOffers);
        };

        loadBranches();
    }, [isRTL]);

    const handleShowMore = (branchId) => {
        setVisibleOffers((prev) => ({
            ...prev,
            [branchId]: prev[branchId] + 4, // هر بار 4 آفر بیشتر
        }));
        setTimeout(() => {
            const element = document.getElementById(`branch-offers-${branchId}`);
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.2 },
        },
    };

    const branchVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <section className="py-12 px-4 flex flex-col items-center">
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
                    {isRTL ? 'فروع هايبر ماكس' : 'Hyper Max Branches'}
                </h2>
                <p
                    className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                    {isRTL
                        ? 'اكتشف فروع هايبر ماكس في مسقط، حيث نقدم كل ما تحتاجه من منتجات عالية الجودة!'
                        : 'Discover Hyper Max branches in Muscat, offering everything you need with top-quality products!'}
                </p>
            </motion.div>

            <motion.div
                className="max-w-7xl w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
                {branches.map((branch) => (
                    <motion.div
                        key={branch.id}
                        className="mb-8 bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-6"
                        variants={branchVariants}
                    >
                        <div className="flex items-center mb-4">
                            <h3
                                className="text-xl font-semibold"
                                style={{ color: '#005A9E' }}
                            >
                                {branch.name}
                            </h3>
                            {branch.isNew && (
                                <div className="flex items-center mr-2">
                                    <FaStar className="text-yellow-400 ml-2" />
                                    <span className="text-sm font-bold text-yellow-400">
                                        {isRTL ? 'جديد' : 'NEW'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 mb-2 flex items-center">
                            <FaMapMarkerAlt className="ml-2 text-red-500" />
                            {branch.address}
                        </p>
                        <a
                            href={branch.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline mb-4 inline-block"
                        >
                            {isRTL ? 'عرض على الخريطة' : 'View on Map'}
                        </a>
                        <div className="mt-4" id={`branch-offers-${branch.id}`}>
                            <h4
                                className="text-base font-medium mb-2"
                                style={{ color: '#A5C93D' }}
                            >
                                {isRTL ? 'عروض الفرع' : 'Branch Offers'} {/* تغییر به Branch Offers */}
                            </h4>
                            <ul className="space-y-2">
                                {branch.pdfs.slice(0, visibleOffers[branch.id] || 4).map((pdf, index) => (
                                    <li key={index}>
                                        <a
                                            href={pdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            {pdf.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <AnimatePresence>
                                {branch.pdfs.length > (visibleOffers[branch.id] || 4) && (
                                    <motion.button
                                        onClick={() => handleShowMore(branch.id)}
                                        className="mt-4 px-6 py-2 rounded-full font-semibold transition-colors duration-300"
                                        style={{
                                            backgroundColor: '#A5C93D',
                                            color: '#FFFFFF',
                                        }}
                                        whileHover={{ scale: 1.05, backgroundColor: '#8BB32E' }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isRTL ? 'عرض المزيد' : 'Show More'}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Branches;