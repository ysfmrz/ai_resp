import React, { useContext, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const SpinWheel = () => {
    const { isRTL } = useContext(LanguageContext);
    const t = isRTL ? ar : en;

    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const controls = useAnimation();

    const colors = [
        '#0077b6', // Navy Blue
        '#00b4d8', // Bright Turquoise
        '#48cae4', // Light Blue
        '#90e0ef', // Aqua Blue
        '#80ed99', // Mint Green
        '#38b000', // Vibrant Green
    ];

    const prizes = t.spinWheel.prizes.map((name, index) => ({
        id: index + 1,
        name,
        color: colors[index % colors.length],
        textColor:
            index % colors.length === 0 || // Navy Blue
                index % colors.length === 4 || // Mint Green
                index % colors.length === 5    // Vibrant Green
                ? '#FFFFFF'
                : '#005A9E',
    }));

    const fixedAngles = [30, 40, 50, 60, 80, 100];
    if (fixedAngles.length !== prizes.length || fixedAngles.reduce((sum, angle) => sum + angle, 0) !== 360) {
        console.error('Fixed angles must match number of prizes and sum to 360 degrees');
    }

    const radius = 150; // Wheel radius

    const spinWheel = () => {
        if (isSpinning || prize) return;

        setIsSpinning(true);
        setPrize(null);

        const randomSpin = 360 * (5 + Math.random() * 5) + Math.random() * 360;
        const finalRotation = rotation + randomSpin;

        controls.start({
            rotate: finalRotation,
            transition: { duration: 5, ease: 'easeOut' },
        }).then(() => {
            const finalAngle = (finalRotation % 360 + 360) % 360;
            const adjustedAngle = (360 - finalAngle) % 360;

            let currentStart = 0;
            let winningSection = -1;

            for (let i = 0; i < fixedAngles.length; i++) {
                const currentEnd = currentStart + fixedAngles[i];
                if (adjustedAngle >= currentStart && adjustedAngle < currentEnd) {
                    winningSection = i;
                    break;
                }
                currentStart = currentEnd;
            }

            if (winningSection === -1) {
                console.error("No winning section found for angle", adjustedAngle);
                winningSection = 0;
            }

            const selectedPrize = prizes[winningSection];
            setPrize(selectedPrize);
            setRotation(finalRotation);
            setIsSpinning(false);
        });
    };

    const getWedgePath = (startAngle, endAngle, radius) => {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = radius + radius * Math.cos(startRad);
        const y1 = radius + radius * Math.sin(startRad);
        const x2 = radius + radius * Math.cos(endRad);
        const y2 = radius + radius * Math.sin(endRad);
        const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
        return `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
    };

    const getFontSize = (text, angle) => {
        const baseFontSize = 12;
        const maxLength = Math.floor(angle / 4);
        if (text.length > maxLength) {
            return Math.max(7, baseFontSize - (text.length - maxLength) * 0.5);
        }
        return Math.min(baseFontSize, 12 - (40 - angle) / 10);
    };

    const validateForm = () => {
        const newErrors = { email: '', phone: '' };
        let isValid = true;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = t.spinWheel.form.errors.emailRequired || 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t.spinWheel.form.errors.emailInvalid || 'Invalid email format';
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^\+?\d{8,15}$/;
        if (!formData.phone) {
            newErrors.phone = t.spinWheel.form.errors.phoneRequired || 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = t.spinWheel.form.errors.phoneInvalid || 'Invalid phone number (8-15 digits, optional +)';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '' });
            setErrors({ email: '', phone: '' });
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center py-8 px-4 min-h-screen">
            {/* Wheel */}
            <div className="relative mt-4 w-[min(80vw,320px)] h-[min(80vw,320px)] max-w-[350px] max-h-[350px] md:w-[min(90vw,400px)] md:h-[min(90vw,400px)] md:max-w-[450px] md:max-h-[450px]">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    className="absolute"
                    animate={controls}
                    style={{ transformOrigin: 'center' }}
                >
                    {prizes.map((prize, index) => {
                        const startAngle = fixedAngles
                            .slice(0, index)
                            .reduce((sum, angle) => sum + angle, 0);
                        const endAngle = startAngle + fixedAngles[index];
                        const midAngle = startAngle + fixedAngles[index] / 2;

                        return (
                            <g key={prize.id}>
                                <path
                                    d={getWedgePath(startAngle, endAngle, radius)}
                                    fill={prize.color}
                                    stroke="#FFFFFF"
                                    strokeWidth="1"
                                />
                                <text
                                    x={radius}
                                    y={radius}
                                    fill={prize.textColor}
                                    fontSize={getFontSize(prize.name, fixedAngles[index])}
                                    fontWeight="500"
                                    textAnchor="start"
                                    dominantBaseline="middle"
                                    transform={`rotate(${midAngle}, ${radius}, ${radius}) translate(55, 0)`}
                                >
                                    {prize.name}
                                </text>
                            </g>
                        );
                    })}
                </motion.svg>

                {/* Indicator Arrow */}
                <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 rotate-90 z-10">
                    <motion.div
                        className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent"
                        style={{ borderTopColor: '#A5C93D' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                </div>
            </div>

            {/* Spin Button */}
            <motion.button
                onClick={spinWheel}
                disabled={isSpinning || prize}
                className={`mt-6 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md ${isSpinning || prize ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                style={{
                    backgroundColor: isSpinning || prize ? '#005A9E80' : '#005A9E',
                    color: '#FFFFFF',
                }}
                whileHover={{ scale: isSpinning || prize ? 1 : 1.05 }}
                whileTap={{ scale: isSpinning || prize ? 1 : 0.95 }}
            >
                {isSpinning ? t.spinWheel.spinning : t.spinWheel.spinNow}
            </motion.button>

            {/* Prize Announcement */}
            {prize && (
                <motion.div
                    className="mt-6 p-6 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] cursor-pointer max-w-[90vw] sm:max-w-md"
                    style={{
                        background: 'linear-gradient(135deg, #00AEEF 0%, #005A9E 100%)',
                        color: '#FFFFFF',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <motion.div
                        className="text-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{t.spinWheel.youWon}</h3>
                        <p className="text-lg sm:text-xl font-semibold">
                            <span style={{ color: '#A5C93D' }}>{prize.name || 'No Prize Name'}</span> {t.spinWheel.won}
                        </p>
                    </motion.div>
                </motion.div>
            )}

            {/* Form Modal */}
            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)] w-full max-w-[90vw] sm:max-w-md overflow-auto max-h-[90vh]"
                        initial={{ scale: 0.8, y: -100 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isSubmitted ? (
                            <div className="text-center">
                                <p className="text-lg font-semibold text-green-600">
                                    {t.spinWheel.successMessage}
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#005A9E' }}>
                                    {t.spinWheel.registerPrize}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {t.spinWheel.registerMessage}
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.spinWheel.form.name}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#005A9E]"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.spinWheel.form.email}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#005A9E] ${errors.email ? 'border-red-500' : ''
                                                }`}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t.spinWheel.form.phone}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+96898765432"
                                            className={`mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-[#005A9E] ${errors.phone ? 'border-red-500' : ''
                                                }`}
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                                        >
                                            {t.spinWheel.form.cancel}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#005A9E] text-white rounded-md hover:bg-[#004682] transition-colors"
                                        >
                                            {t.spinWheel.form.submit}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default SpinWheel;