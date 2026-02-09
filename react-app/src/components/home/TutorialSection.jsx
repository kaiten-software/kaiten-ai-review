import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { StarIcon, CheckCircleIcon, SparklesIcon, BoltIcon, GlobeAltIcon, QrCodeIcon } from '@heroicons/react/24/solid';

const steps = [
    {
        id: 1,
        title: "Scan & Engage",
        description: "Customers scan your unique QR code. No app install needed.",
        icon: <QrCodeIcon className="w-5 h-5" />,
        color: "#2563EB", // blue-600
        bg: "bg-blue-50",
        avatarExpression: "https://cdn3d.iconscout.com/3d/premium/thumb/man-holding-phone-2937683-2426383.png"
    },
    {
        id: 2,
        title: "Quick 5-Star Rating",
        description: "A frictionless interface encourages high ratings in seconds.",
        icon: <StarIcon className="w-5 h-5" />,
        color: "#F59E0B", // amber-500
        bg: "bg-amber-50",
        avatarExpression: "https://cdn3d.iconscout.com/3d/premium/thumb/man-giving-five-star-rating-2937691-2426391.png"
    },
    {
        id: 3,
        title: "AI-Powered Writing",
        description: "Our AI constructs a detailed, professional review for them.",
        icon: <SparklesIcon className="w-5 h-5" />,
        color: "#9333EA", // purple-600
        bg: "bg-purple-50",
        avatarExpression: "https://cdn3d.iconscout.com/3d/premium/thumb/man-working-on-laptop-2937678-2426378.png"
    },
    {
        id: 4,
        title: "Instant Google Post",
        description: "Reviews are posted directly to Google Maps in one tap.",
        icon: <GlobeAltIcon className="w-5 h-5" />,
        color: "#10B981", // emerald-500
        bg: "bg-emerald-50",
        avatarExpression: "https://cdn3d.iconscout.com/3d/premium/thumb/man-showing-thumbs-up-2937697-2426397.png"
    }
];

// 3D Tilt Card Component
function TiltCard({ children, className }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
    const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

    return (
        <motion.div
            className={className}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
            {children}
        </motion.div>
    );
}

export default function TutorialSection() {
    const [currentStep, setCurrentStep] = useState(0);
    const containerRef = useRef(null);
    const STEP_DURATION = 750; // 0.75 seconds

    // Auto-advance loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, STEP_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden bg-white">

            {/* --- LIGHT BACKGROUND --- */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/20">
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>
            </div>

            <div className="container-custom relative z-10 px-4">

                {/* --- HEADER --- */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <BoltIcon className="w-3.5 h-3.5" />
                        <span>Seamless Workflow</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        Reviewing, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined.</span>
                    </motion.h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* --- LEFT: INTERACTIVE STEPS WITH AVATAR --- */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full space-y-2">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={`relative group cursor-pointer p-5 rounded-2xl transition-all duration-300 flex items-center gap-5 ${index === currentStep
                                    ? 'bg-white shadow-xl shadow-slate-200 ring-1 ring-slate-100 scale-105 z-10'
                                    : 'hover:bg-slate-50 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                {/* Circular Progress Icon */}
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="24" cy="24" r="22"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            className="text-slate-100"
                                        />
                                        {index === currentStep && (
                                            <motion.circle
                                                cx="24" cy="24" r="22"
                                                stroke={step.color}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray="138" // 2 * PI * 22
                                                initial={{ strokeDashoffset: 138 }}
                                                animate={{ strokeDashoffset: 0 }}
                                                transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                                                strokeLinecap="round"
                                            />
                                        )}
                                    </svg>
                                    <div className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm`} style={{ backgroundColor: step.color }}>
                                        {step.icon}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h3 className={`text-lg font-bold transition-colors ${index === currentStep ? 'text-slate-900' : 'text-slate-600'
                                        }`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed mt-1 transition-colors ${index === currentStep ? 'text-slate-600' : 'text-slate-400'
                                        }`}>
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* --- RIGHT: 3D PHONE + AVATAR --- */}
                    <div className="lg:col-span-7 relative flex justify-center perspective-1000 mt-12 lg:mt-0">

                        {/* 3D AVATAR NARRATOR */}
                        <motion.div
                            className="absolute -left-4 lg:-left-20 top-20 z-30 w-32 h-32 lg:w-40 lg:h-40 pointer-events-none drop-shadow-2xl"
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <AnimatePresence mode="popLayout">
                                <motion.img
                                    key={currentStep}
                                    src={steps[currentStep].avatarExpression || "https://cdn3d.iconscout.com/3d/premium/thumb/man-holding-phone-2937683-2426383.png"}
                                    alt="Avatar"
                                    className="w-full h-full object-contain"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                                    transition={{ duration: 0.15 }}
                                />
                            </AnimatePresence>
                        </motion.div>

                        {/* PHONE CONTAINER */}
                        <TiltCard className="relative w-[320px] h-[640px] rounded-[3rem] bg-slate-900 shadow-2xl shadow-slate-400/30 border-[8px] border-slate-800 overflow-hidden z-20 mx-auto">

                            {/* SCREEN */}
                            <div className="absolute inset-0.5 bg-white rounded-[2.8rem] overflow-hidden z-10">

                                {/* Status Bar */}
                                <div className="h-12 w-full flex justify-between items-end px-6 pb-2 text-slate-900 text-[10px] font-bold">
                                    <span>9:41</span>
                                    <div className="flex gap-1">
                                        <div className="w-3.5 h-3.5 bg-slate-900 rounded-sm"></div>
                                        <div className="w-3.5 h-3.5 bg-slate-900 rounded-sm"></div>
                                    </div>
                                </div>

                                {/* HEADER */}
                                <div className="px-5 py-3 border-b border-slate-50 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                                    <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                                            <div className="flex flex-col gap-0.5">
                                                <div className="h-2 w-16 bg-slate-200 rounded-full" />
                                                <div className="h-1.5 w-10 bg-slate-100 rounded-full" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* --- DYNAMIC CONTENT AREA --- */}
                                <div className="h-full relative px-5 mt-4 bg-slate-50/30">
                                    <AnimatePresence mode="popLayout">

                                        {/* SCENE 1: QR CODE */}
                                        {currentStep === 0 && (
                                            <motion.div
                                                key="scene1"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col items-center justify-center h-[400px]"
                                            >
                                                <div className="relative bg-white p-6 rounded-3xl shadow-lg shadow-blue-100/50 border border-blue-50">
                                                    <QrCodeIcon className="w-32 h-32 text-slate-800" />
                                                    <motion.div
                                                        animate={{ top: ["10%", "90%", "10%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                        className="absolute left-[10%] w-[80%] h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                                    />
                                                </div>
                                                <p className="mt-6 text-sm font-semibold text-slate-500 animate-pulse">Scanning...</p>
                                            </motion.div>
                                        )}

                                        {/* SCENE 2: RATING UI */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                key="scene2"
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -30 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col h-[400px]"
                                            >
                                                <div className="bg-white p-5 rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-50/50">
                                                    <h3 className="text-lg font-bold text-slate-900 text-center mb-4">How was it?</h3>
                                                    <div className="flex justify-center gap-1.5 mb-6">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: i * 0.05, type: "spring" }}
                                                            >
                                                                <StarIcon className="w-8 h-8 text-amber-400 drop-shadow-sm" />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {['Great Service', 'Fast', 'Clean'].map((tag, i) => (
                                                            <motion.div
                                                                key={tag}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.1 + (i * 0.05) }}
                                                                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700"
                                                            >
                                                                {tag}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* SCENE 3: AI GENERATION */}
                                        {currentStep === 2 && (
                                            <motion.div
                                                key="scene3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col h-[400px] pt-4"
                                            >
                                                <div className="relative p-5 bg-white rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/50 overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <SparklesIcon className="w-3 h-3 text-indigo-600 animate-spin-slow" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">AI Writer</span>
                                                    </div>
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-sm font-medium text-slate-700 leading-relaxed font-serif"
                                                    >
                                                        "Incredible experience! The staff was friendly and the service was super fast. Does exactly what it promises!"
                                                    </motion.p>
                                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50 animate-shimmer" />
                                                </div>
                                                <motion.button
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 text-sm hover:scale-105 transition-transform"
                                                >
                                                    Post to Google
                                                </motion.button>
                                            </motion.div>
                                        )}

                                        {/* SCENE 4: SUCCESS */}
                                        {currentStep === 3 && (
                                            <motion.div
                                                key="scene4"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col items-center justify-center h-[400px] text-center"
                                            >
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl animate-pulse"></div>
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl relative z-10 border-4 border-emerald-50">
                                                        <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 mb-1">Posted!</h3>
                                                <p className="text-slate-500 text-xs mb-6 px-10">Review is live on Google Maps.</p>

                                                <div className="px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm flex items-center gap-2">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-4 h-4" />
                                                    <span className="font-bold text-slate-700 text-xs">Google Reviews</span>
                                                </div>
                                            </motion.div>
                                        )}

                                    </AnimatePresence>
                                </div>
                            </div>
                        </TiltCard>

                    </div>
                </div>
            </div>
        </section>
    );
}
