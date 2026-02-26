import { motion } from 'framer-motion';
import {
    BuildingOfficeIcon,
    SparklesIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function AboutUs() {
    return (
        <div className="space-y-12 p-8">
            {/* Company Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 md:p-12 border border-blue-100 shadow-lg"
            >
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BuildingOfficeIcon className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-3 text-gray-900">About RankBag</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Leading IT company based in Jaipur, India, specializing in cutting-edge technology solutions
                            for businesses of all sizes. We combine innovation with expertise to deliver exceptional results.
                        </p>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {[
                        { icon: '🤖', title: 'AI Automation', desc: 'Intelligent automation solutions' },
                        { icon: '💼', title: 'ERP Systems', desc: 'Enterprise resource planning' },
                        { icon: '💻', title: 'Software Development', desc: 'Custom software solutions' },
                        { icon: '📱', title: 'Mobile Apps', desc: 'iOS & Android development' },
                        { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure' },
                        { icon: '🔗', title: 'IoT Development', desc: 'Connected device solutions' }
                    ].map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="text-4xl mb-3">{service.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Company Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-blue-200">
                    {[
                        { number: '500+', label: 'Projects Delivered' },
                        { number: '200+', label: 'Happy Clients' },
                        { number: '50+', label: 'Team Members' },
                        { number: '10+', label: 'Years Experience' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* About AI Review Platform */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <RocketLaunchIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">RankBag AI Reviews</h3>
                </div>

                <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        <strong>RankBag</strong> is our flagship SaaS product designed to revolutionize
                        how businesses collect and manage customer reviews. Built with cutting-edge AI technology, this platform
                        helps businesses boost their online reputation effortlessly.
                    </p>

                    <div className="bg-gradient-to-br from-cyan-50 to-purple-50 p-8 rounded-2xl border border-cyan-100">
                        <h4 className="font-bold text-xl mb-6 text-gray-900">Key Features:</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { color: 'cyan', title: 'AI-Powered Review Generation', desc: 'Generate authentic, personalized reviews using advanced AI' },
                                { color: 'purple', title: 'QR Code System', desc: 'Easy customer access via scannable QR codes' },
                                { color: 'blue', title: 'Analytics Dashboard', desc: 'Comprehensive insights and conversion tracking' },
                                { color: 'indigo', title: 'Multi-Business Management', desc: 'Manage multiple locations from one dashboard' },
                                { color: 'pink', title: 'WhatsApp Integration', desc: 'Automated customer communication and follow-ups' },
                                { color: 'orange', title: 'Private Feedback', desc: 'Collect and address concerns privately' }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className={`w-8 h-8 bg-${feature.color}-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md`}>
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 mb-1">{feature.title}</div>
                                        <div className="text-sm text-gray-600 leading-relaxed">{feature.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                        <h4 className="font-bold text-2xl mb-3">Transform Your Business Reputation</h4>
                        <p className="text-white/95 text-lg leading-relaxed">
                            Join hundreds of businesses using RankBag to build trust,
                            attract more customers, and grow their online presence with authentic, AI-generated reviews.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-10 md:p-12 shadow-2xl"
            >
                <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="font-semibold text-xl mb-3 flex items-center gap-2">
                            <span>📍</span> Address
                        </div>
                        <p className="text-white/90 text-lg leading-relaxed">
                            B-95 Bhan Nagar, Prince Road<br />
                            Jaipur, Rajasthan 302021<br />
                            India
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="font-semibold text-xl mb-3 flex items-center gap-2">
                            <span>🌐</span> Website
                        </div>
                        <a
                            href="https://rankbag.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-lg transition-colors inline-block"
                        >
                            www.rankbag.com
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
