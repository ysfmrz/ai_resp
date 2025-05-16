import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import { FaStar } from 'react-icons/fa'; // اضافه کردن FaStar

const LatestOffers = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;
    const [visibleOffers, setVisibleOffers] = useState(8); // حداکثر 8 کارت (2 ردیف)
    const [offers, setOffers] = useState([]);

    // تعریف 9 فایل PDF و thumbnail
    useEffect(() => {
        const loadOffers = async () => {
            const offerList = Array.from({ length: 9 }, (_, i) => ({
                id: i + 1,
                title: isRTL ? `عرضه ${i + 1}` : `Offer ${i + 1}`,
                description: isRTL
                    ? `اكتشف عرضنا الحصري رقم ${i + 1} المتوفر هذا الأسبوع!`
                    : `Discover our exclusive Offer ${i + 1} available this week!`,
                pdfUrl: `/offers/offer${i + 1}.pdf`,
                thumbnail: `/offers/offer${i + 1}.JPG`,
                branch: isRTL ? 'جميع الفروع' : 'All Branches',
                isNew: i < 2, // آفرهای 1 و 2 (id: 1 و 2) جدیدن
            }));

            // چک کردن وجود فایل‌های PDF و thumbnail
            for (const offer of offerList) {
                try {
                    const pdfResponse = await fetch(offer.pdfUrl);
                    if (!pdfResponse.ok) {
                        console.error(`PDF file not found: ${offer.pdfUrl}`);
                    }
                    const thumbResponse = await fetch(offer.thumbnail);
                    if (!thumbResponse.ok) {
                        console.error(`Thumbnail not found: ${offer.thumbnail}`);
                    }
                } catch (error) {
                    console.error(`Error checking files for ${offer.title}:`, error);
                }
            }

            setOffers(offerList);
        };

        loadOffers();
    }, [isRTL]);

    const handleShowMore = () => {
        setVisibleOffers((prev) => prev + 4); // هر بار 4 کارت بیشتر
        setTimeout(() => {
            const element = document.getElementById('offers-list');
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
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
                    {t.header.offers || 'Latest Offers'}
                </h2>
                <p
                    className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                    {isRTL
                        ? 'استمتع بأحدث العروض الحصرية من هايبر ماكس، متوفرة في فروع مختارة أو جميع الفروع!'
                        : 'Explore the latest exclusive offers from Hyper Max, available at selected branches or all stores!'}
                </p>
            </motion.div>

            <motion.div
                id="offers-list"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
                {offers.slice(0, visibleOffers).map((offer) => (
                    <motion.div
                        key={offer.id}
                        className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col w-full max-w-[250px] mx-auto"
                        variants={cardVariants}
                        whileHover={{ scale: 1.05, boxShadow: '0_8px_25px_rgba(0,0,0,0.15)' }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <a href={offer.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={offer.thumbnail}
                                alt={offer.title}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                    console.error(`Thumbnail not found: ${offer.thumbnail}`);
                                    e.target.src = '/offers/placeholder.jpg';
                                }}
                            />
                        </a>
                        <div className="p-3 flex flex-col flex-grow">
                            <div className="flex items-center mb-1">
                                <h3
                                    className="text-base font-semibold truncate"
                                    style={{ color: '#005A9E' }}
                                >
                                    {offer.title}
                                </h3>
                                {offer.isNew && (
                                    <div className="flex items-center mr-2">
                                        <FaStar className="text-yellow-400 ml-2" />
                                        <span className="text-sm font-bold text-yellow-400">
                                            {isRTL ? 'جديد' : 'NEW'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 flex-grow line-clamp-2">
                                {offer.description}
                            </p>
                            <p
                                className="text-xs font-medium mb-3"
                                style={{ color: '#A5C93D' }}
                            >
                                {isRTL ? 'الفرع:' : 'Branch:'} {offer.branch}
                            </p>
                            <a
                                href={offer.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full text-center font-medium text-sm transition-colors duration-300"
                                style={{
                                    backgroundColor: '#005A9E',
                                    color: '#FFFFFF',
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = '#004682')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = '#005A9E')
                                }
                            >
                                {isRTL ? 'عرض التفاصيل' : 'View Details'}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {visibleOffers < offers.length && (
                    <motion.button
                        onClick={handleShowMore}
                        className="mt-8 px-6 py-2 rounded-full font-semibold transition-colors duration-300"
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
        </section>
    );
};

export default LatestOffers;