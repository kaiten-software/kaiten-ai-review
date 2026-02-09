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
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="ensoGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#DC2626" />
                            <stop offset="50%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#DC2626" />
                        </linearGradient>
                    </defs>

                    {/* Enso Circle - Main stroke */}
                    <path
                        d="M 60 10 C 75 10, 88 14, 98 23 C 106 31, 110 42, 110 60 C 110 75, 106 88, 97 98 C 88 107, 75 111, 60 111 C 45 111, 32 107, 23 98 C 14 89, 10 76, 10 60 C 10 45, 14 32, 23 23 C 32 14, 45 10, 60 10 L 60 12"
                        stroke="url(#ensoGradIcon)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.95"
                    />

                    {/* Inner highlight */}
                    <path
                        d="M 60 15 C 73 15, 84 19, 92 28 C 99 36, 103 47, 103 60 C 103 73, 99 84, 91 92 C 83 100, 72 104, 60 104 C 47 104, 36 100, 28 92 C 20 84, 16 73, 16 60 C 16 47, 20 36, 28 28 C 36 20, 47 16, 60 16"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
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
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="ensoGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DC2626" />
                        <stop offset="50%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                </defs>

                {/* Enso Circle - Main brush stroke */}
                <path
                    d="M 60 8 C 76 8, 90 13, 100 24 C 109 34, 113 47, 113 60 C 113 76, 109 90, 99 100 C 89 109, 76 113, 60 113 C 44 113, 30 109, 20 99 C 11 89, 7 76, 7 60 C 7 44, 11 30, 21 20 C 31 11, 44 7, 60 7 L 60 10"
                    stroke="url(#ensoGradFull)"
                    strokeWidth="11"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.95"
                />

                {/* Inner highlight stroke */}
                <path
                    d="M 60 14 C 74 14, 86 18, 94 28 C 101 37, 105 48, 105 60 C 105 74, 101 86, 93 94 C 85 102, 73 106, 60 106 C 46 106, 34 102, 26 94 C 18 86, 14 74, 14 60 C 14 46, 18 34, 26 26 C 34 18, 46 14, 60 14"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Outer texture stroke */}
                <path
                    d="M 60 4 C 78 4, 93 10, 104 22 C 113 32, 117 45, 117 60 C 117 78, 111 93, 101 104 C 91 113, 78 117, 60 117 C 42 117, 27 111, 16 101 C 7 91, 3 78, 3 60 C 3 42, 9 27, 19 16 C 29 7, 42 3, 60 3"
                    stroke="url(#ensoGradFull)"
                    strokeWidth="2"
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
