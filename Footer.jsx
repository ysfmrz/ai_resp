import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const Footer = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;

    const footerLinks = [
        { name: t.footer.links[0].name, href: t.footer.links[0].href },
        { name: t.footer.links[1].name, href: t.footer.links[1].href },
        { name: t.footer.links[2].name, href: t.footer.links[2].href },
    ];

    const footerVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <motion.footer
            className="py-3 mt-auto shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t"
            style={{
                background: 'linear-gradient(to right, rgba(0, 90, 158, 0.8), rgba(0, 174, 239, 0.8))', // گرادینت از آبی تیره به آبی روشن
                backdropFilter: 'blur(10px)', // افکت شیشه‌ای
                borderColor: 'rgba(255, 255, 255, 0.1)', // حاشیه سفید شفاف
            }}
            variants={footerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2">
                <div className={`flex items-center gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <motion.img
                        src="/hypmx.png"
                        alt={t.header.logoAlt}
                        className="h-8"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <motion.p
                        className="text-sm font-medium"
                        style={{ color: '#FFFFFF' }} // سفید
                        whileHover={{ scale: 1.05, color: '#A5C93D' }} // سبز سیب هنگام hover
                    >
                        {t.footer.tagline}
                    </motion.p>
                </div>

                <motion.p
                    className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ color: '#FFFFFF' }} // سفید
                    whileHover={{ scale: 1.05, color: '#A5C93D' }} // سبز سیب هنگام hover
                >
                    {t.footer.copyright}
                </motion.p>
            </div>

            <motion.div
                className="flex flex-col md:flex-row justify-center items-center py-1"
                style={{
                    backgroundColor: 'transparent', // پس‌زمینه شفاف برای هماهنگی
                }}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
            >
                <ul
                    className={`flex flex-col md:flex-row gap-2 text-sm font-medium ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'
                        }`} // فاصله کمتر (gap-2)
                >
                    {footerLinks.map((link, index) => (
                        <motion.li
                            key={index}
                            whileHover={{ scale: 1.1, color: '#A5C93D' }} // سبز سیب هنگام hover
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <a
                                href={link.href}
                                className="block px-2 py-1 transition-colors duration-300" // پدینگ کمتر
                                style={{
                                    color: '#FFFFFF', // سفید
                                }}
                            >
                                {link.name}
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;