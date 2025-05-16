import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // پیش‌فرض انگلیسی
    const isRTL = language === 'ar'; // اضافه کردن isRTL

    useEffect(() => {
        document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, isRTL, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};