import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
    ArrowUpRightIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '/#features', type: 'anchor' },
            { name: 'Pricing', href: '/#pricing', type: 'anchor' },
            { name: 'Find Business', href: '/#businesses', type: 'anchor' },
            { name: 'Client Dashboard', href: '/login', type: 'internal', isButton: true },
            { name: 'Admin Control', href: '/admin/login', type: 'internal' },
        ],
        company: [
            { name: 'About RankBag', href: 'https://rankbag.com', type: 'external' },
            { name: 'Services', href: 'https://rankbag.com/services', type: 'external' },
            { name: 'Contact', href: '#contact', type: 'anchor' },
            { name: 'Careers', href: '#careers', type: 'anchor' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy', type: 'internal' },
            { name: 'Terms of Service', href: '/terms', type: 'internal' },
            { name: 'Refund Policy', href: '/refund', type: 'internal' },
        ],
        social: [
            { name: 'Twitter', href: '#', icon: '𝕏' },
            { name: 'LinkedIn', href: '#', icon: 'in' },
            { name: 'Instagram', href: '#', icon: '📷' },
        ],
    };

    return (
        <footer className="relative overflow-hidden bg-[#0F172A] border-t border-slate-800">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="container-custom py-8 sm:py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Logo size="medium" variant="full" className="mb-4 sm:mb-6" isDark />
                        <p className="text-slate-400 mb-6 sm:mb-8 max-w-sm leading-relaxed text-sm">
                            Empowering businesses with AI-driven reputation management. Turn positive feedback into growth.
                        </p>

                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <div className="flex items-start gap-3 text-slate-400">
                                <MapPinIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <span className="text-sm">B-95 Bhan Nagar, Prince Road,<br />Jaipur, Rajasthan 302021</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <GlobeAltIcon className="w-5 h-5 text-blue-500 shrink-0" />
                                <a href="https://rankbag.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors">
                                    www.rankbag.com
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {footerLinks.social.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="w-10 h-10 bg-slate-800/50 hover:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 hover:border-blue-500/50 transition-all group"
                                >
                                    <span className="text-slate-400 group-hover:text-white transition-colors">{link.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {[
                        { title: 'Product', links: footerLinks.product },
                        { title: 'Company', links: footerLinks.company },
                        { title: 'Legal', links: footerLinks.legal }
                    ].map((col) => (
                        <div key={col.title}>
                            <h3 className="font-bold text-white mb-4 sm:mb-6">{col.title}</h3>
                            <ul className="space-y-3 sm:space-y-4">
                                {col.links.map((link) => (
                                    <li key={link.name}>
                                        {link.isButton ? (
                                            <Link
                                                to={link.href}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20"
                                            >
                                                {link.name}
                                            </Link>
                                        ) : link.type === 'internal' ? (
                                            <Link to={link.href} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                                                {link.name}
                                            </Link>
                                        ) : link.type === 'anchor' ? (
                                            <a href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                                                {link.name}
                                            </a>
                                        ) : (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                                            >
                                                {link.name}
                                                <ArrowUpRightIcon className="w-3 h-3 opacity-50" />
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} RankBag. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-slate-500 text-sm flex items-center gap-1.5">
                            Made with <span className="text-red-500 animate-pulse">❤️</span> in Jaipur
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
