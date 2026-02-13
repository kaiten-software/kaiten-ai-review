import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', variant = 'full', className = '', isDark = false }) => {
    const sizes = {
        small: { width: 220, height: 60, fontSize: '1.375rem', subFontSize: '0.7rem', iconSize: 55 },
        medium: { width: 280, height: 75, fontSize: '1.75rem', subFontSize: '0.8rem', iconSize: 70 },
        large: { width: 360, height: 95, fontSize: '2.25rem', subFontSize: '0.95rem', iconSize: 90 },
    };

    const currentSize = sizes[size];
    // Always use red circle, but change text color based on background
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const subColor = isDark ? 'text-white' : 'text-red-600';

    if (variant === 'icon') {
        return (
            <motion.div
                className={`inline-flex items-center justify-center ${className}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                <svg
                    width={currentSize.iconSize}
                    height={currentSize.iconSize}
                    viewBox="0 0 1024 1024"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="ensoGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="50%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#B91C1C" />
                        </linearGradient>
                    </defs>

                    {/* Main Enso Circle Path */}
                    <path d="M 512 50 C 650 50, 780 100, 870 200 C 950 290, 990 410, 990 512 C 990 650, 940 780, 840 870 C 750 950, 630 990, 512 990 C 380 990, 250 940, 160 850 C 70 760, 30 640, 30 512 C 30 380, 80 250, 170 160 C 260 70, 380 30, 512 30 L 512 50"
                        stroke="url(#ensoGradIcon)"
                        strokeWidth="80"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.95"
                    />

                    {/* Inner highlight stroke */}
                    <path d="M 512 80 C 630 80, 740 120, 820 210 C 890 290, 930 390, 930 512 C 930 630, 890 740, 810 820 C 730 900, 620 940, 512 940 C 400 940, 290 900, 210 820 C 130 740, 90 630, 90 512 C 90 400, 130 290, 210 210 C 290 130, 400 90, 512 90"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Outer brush texture */}
                    <path d="M 512 20 C 660 20, 800 80, 900 190 C 980 280, 1020 400, 1020 512 C 1020 660, 960 800, 860 900 C 770 980, 650 1020, 512 1020 C 370 1020, 230 960, 130 860 C 50 770, 10 650, 10 512 C 10 370, 70 230, 160 130 C 250 50, 370 10, 512 10"
                        stroke="url(#ensoGradIcon)"
                        strokeWidth="15"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.4"
                    />
                </svg>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`inline-flex items-center gap-4 ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            {/* Icon */}
            <svg
                width={currentSize.iconSize}
                height={currentSize.iconSize}
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={`${variant === 'icon' ? 'ensoGradIcon' : 'ensoGradFull'}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DC2626" />
                        <stop offset="50%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                </defs>

                {/* Main Enso Circle Path */}
                <path d="M 512 50 C 650 50, 780 100, 870 200 C 950 290, 990 410, 990 512 C 990 650, 940 780, 840 870 C 750 950, 630 990, 512 990 C 380 990, 250 940, 160 850 C 70 760, 30 640, 30 512 C 30 380, 80 250, 170 160 C 260 70, 380 30, 512 30 L 512 50"
                    stroke={`url(#${variant === 'icon' ? 'ensoGradIcon' : 'ensoGradFull'})`}
                    strokeWidth="80"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.95"
                />

                {/* Inner highlight stroke */}
                <path d="M 512 80 C 630 80, 740 120, 820 210 C 890 290, 930 390, 930 512 C 930 630, 890 740, 810 820 C 730 900, 620 940, 512 940 C 400 940, 290 900, 210 820 C 130 740, 90 630, 90 512 C 90 400, 130 290, 210 210 C 290 130, 400 90, 512 90"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Outer brush texture */}
                <path d="M 512 20 C 660 20, 800 80, 900 190 C 980 280, 1020 400, 1020 512 C 1020 660, 960 800, 860 900 C 770 980, 650 1020, 512 1020 C 370 1020, 230 960, 130 860 C 50 770, 10 650, 10 512 C 10 370, 70 230, 160 130 C 250 50, 370 10, 512 10"
                    stroke={`url(#${variant === 'icon' ? 'ensoGradIcon' : 'ensoGradFull'})`}
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                />
            </svg>

            {/* Text */}
            <div className="flex flex-col leading-tight">
                <span
                    className={`font-display font-bold ${textColor}`}
                    style={{
                        fontSize: currentSize.fontSize,
                        letterSpacing: '-0.02em',
                        textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
                    }}
                >
                    KAITEN SOFTWARE
                </span>
                <span
                    className={`${subColor} font-bold tracking-wide`}
                    style={{
                        fontSize: currentSize.subFontSize,
                        marginTop: '4px',
                        letterSpacing: '0.08em',
                        textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
                        opacity: isDark ? '0.95' : '1'
                    }}
                >
                    AI REVIEW PLATFORM
                </span>
            </div>
        </motion.div>
    );
};

export default Logo;
