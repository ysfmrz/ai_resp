import React, { useContext, useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

function Header() {
    const { isRTL, toggleLanguage } = useContext(LanguageContext);
    const t = isRTL ? ar : en;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (!desktop) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen && !isDesktop) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, isDesktop]);

    const menuItems = [
        { href: '/', label: t.header.spin },
        { href: '/offers', label: t.header.offers },
        { href: '/branches', label: t.header.branches },
        { href: '/suggest', label: t.header.suggest },
        { href: '/feedback', label: t.header.feedback },
        { href: '/eid-al-adha', label: t.header.eidAlAdha, target: '_blank' }, // تب جدید
    ];

    const headerVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const menuVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
    };

    return (
        <motion.nav
            ref={menuRef}
            className="fixed w-full top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-b"
            style={{
                background: 'linear-gradient(to right, rgba(0, 90, 158, 0.8), rgba(0, 174, 239, 0.8))',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                    <motion.img
                        src="/hypmx.png"
                        alt={t.header.logoAlt}
                        className="h-10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <motion.h1
                        className="text-2xl font-bold tracking-tight transition-colors duration-300"
                        style={{ color: '#FFFFFF' }}
                        whileHover={{ scale: 1.05, color: '#A5C93D' }}
                    >
                        {isRTL ? 'هايبر ماكس' : 'yper Max'}
                    </motion.h1>
                </div>
                <div className="md:hidden flex items-center">
                    <motion.button
                        onClick={toggleMenu}
                        className="focus:outline-none rounded-full p-2 transition-all duration-300 shadow-md"
                        style={{ backgroundColor: 'rgba(0, 90, 158, 0.5)' }}
                        whileHover={{ backgroundColor: 'rgba(0, 174, 239, 0.7)' }}
                        aria-label={t.header.menuToggle || 'Toggle Menu'}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaBars size={18} color="#FFFFFF" />
                    </motion.button>
                </div>
                <div className="flex items-center">
                    <motion.button
                        onClick={toggleLanguage}
                        className="flex items-center px-3 py-1.5 rounded-full focus:outline-none transition-all duration-300 shadow-md"
                        style={{ backgroundColor: 'rgba(0, 174, 239, 0.5)', color: '#FFFFFF' }}
                        whileHover={{ backgroundColor: 'rgba(0, 90, 158, 0.7)', scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={t.header.changeLanguage || 'Change Language'}
                    >
                        <span className="text-sm font-medium">{isRTL ? 'EN' : 'AR'}</span>
                    </motion.button>
                </div>
            </div>
            <AnimatePresence>
                {(isDesktop || isMenuOpen) && (
                    <motion.div
                        className="flex flex-col md:flex-row justify-center items-center py-2"
                        style={{
                            backgroundColor: isDesktop ? 'transparent' : 'rgba(0, 90, 158, 0.8)',
                        }}
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <ul
                            className={`flex flex-col md:flex-row gap-4 text-base font-medium ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'
                                }`}
                        >
                            {menuItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ scale: 1.1, color: '#A5C93D' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Link
                                        to={item.href}
                                        className="block px-4 py-2 md:px-3 md:py-1 rounded-md transition-colors duration-300"
                                        style={{
                                            color: '#FFFFFF',
                                            backgroundColor: isDesktop
                                                ? 'transparent'
                                                : 'rgba(0, 174, 239, 0.2)',
                                        }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Header;