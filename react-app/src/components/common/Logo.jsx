import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', variant = 'full', className = '', isDark = false }) => {
    const sizes = {
        small: { fontSize: '1.4rem', subFontSize: '0.65rem', iconSize: 42 },
        medium: { fontSize: '1.8rem', subFontSize: '0.75rem', iconSize: 52 },
        large: { fontSize: '2.6rem', subFontSize: '0.9rem', iconSize: 75 },
    };

    const currentSize = sizes[size];

    // Corporate, Clean Colors (No overly fancy gradients on the text)
    const textTheme = isDark ? "text-white" : "text-[#0B2046]";
    const textAccent = isDark ? "text-[#4BC1D9]" : "text-[#24889F]";
    const subTheme = isDark ? "text-slate-400" : "text-slate-500";

    const IconSVG = () => (
        <svg
            width={currentSize.iconSize}
            height={currentSize.iconSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask id="bagMask">
                <rect width="100" height="100" fill="white" />
                <path d="M 22,76 L 38,60 L 48,60 L 75,33" fill="none" stroke="black" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </mask>

            {/* The Bag and Bars, grouped and masked for the cutout effect */}
            <g mask="url(#bagMask)">
                {/* Bag Handle */}
                <path d="M 40,35 V 25 A 10,10 0 0 1 60,25 V 35" fill="none" stroke="#0B2046" strokeWidth="6" />
                {/* Bag Body */}
                <polygon points="25,75 75,75 70,35 30,35" fill="#0B2046" />

                {/* Teal Bars */}
                <rect x="32" y="55" width="6" height="20" fill="#24889F" />
                <rect x="42" y="47" width="6" height="28" fill="#24889F" />
                <rect x="52" y="39" width="6" height="36" fill="#24889F" />
                <rect x="62" y="35" width="6" height="40" fill="#24889F" />
            </g>

            {/* The solid Teal arrow that extends outward */}
            <path d="M 68,40 L 75,33" fill="none" stroke="#24889F" strokeWidth="6" strokeLinecap="round" />
            {/* Arrow Head (perfect 45 degrees) */}
            <polygon points="69,29 80,29 80,40" fill="#24889F" />
        </svg>
    );

    if (variant === 'icon') {
        return (
            <motion.div
                className={`inline-flex items-center justify-center ${className}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                <IconSVG />
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`inline-flex items-center gap-3.5 ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <IconSVG />

            <div className="flex flex-col pt-1">
                {/* Changed leading-none to leading-tight and added pb-1 to prevent the 'g' from clipping */}
                <span className="flex items-baseline leading-tight pb-1">
                    <span
                        className={`font-display font-extrabold tracking-tight ${textTheme}`}
                        style={{ fontSize: currentSize.fontSize }}
                    >
                        Rank
                    </span>
                    <span
                        className={`font-display font-extrabold tracking-tight ${textAccent}`}
                        style={{ fontSize: currentSize.fontSize }}
                    >
                        Bag
                    </span>
                </span>

                <span
                    className={`${subTheme} font-semibold tracking-[0.25em] uppercase`}
                    style={{ fontSize: currentSize.subFontSize, marginTop: '-0.2rem' }}
                >
                    AI REVIEWS
                </span>
            </div>
        </motion.div>
    );
};

export default Logo;
