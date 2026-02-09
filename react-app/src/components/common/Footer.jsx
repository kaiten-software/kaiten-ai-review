import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '/#features' },
            { name: 'Pricing', href: '/#pricing' },
            { name: 'Give Review', href: '/#businesses' },
            { name: 'Admin Login', href: '/admin/login' },
        ],
        company: [
            { name: 'About Kaiten Software', href: 'https://kaitensoftware.com' },
            { name: 'Our Services', href: 'https://kaitensoftware.com' },
            { name: 'Contact Us', href: '#contact' },
            { name: 'Careers', href: '#careers' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#privacy' },
            { name: 'Terms of Service', href: '#terms' },
            { name: 'Refund Policy', href: '#refund' },
            { name: 'Cookie Policy', href: '#cookies' },
        ],
        social: [
            { name: 'Twitter', href: '#', icon: '𝕏' },
            { name: 'Facebook', href: '#', icon: 'f' },
            { name: 'Instagram', href: '#', icon: '📷' },
            { name: 'LinkedIn', href: '#', icon: 'in' },
        ],
    };

    return (
        <footer className="relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="container-custom py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Logo size="medium" variant="full" className="mb-6" isDark />
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            AI-powered review platform by <strong className="text-white">Kaiten Software</strong>.
                            Transform your customer reviews and boost your online reputation effortlessly.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-300">
                                <MapPinIcon className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm">B-95 Bhan Nagar, Prince Road, Jaipur, RJ 302021</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <GlobeAltIcon className="w-5 h-5 text-cyan-400" />
                                <a href="https://kaitensoftware.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-cyan-400 transition-colors">
                                    www.kaitensoftware.com
                                </a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {footerLinks.social.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 group"
                                    title={link.name}
                                >
                                    <span className="text-white font-bold group-hover:scale-110 transition-transform">{link.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-300 hover:text-cyan-400 transition-colors text-sm" target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} <span className="text-white font-semibold">Kaiten Software</span>. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            Made with <span className="text-red-500 animate-pulse">❤️</span> in Jaipur, India
                        </p>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-500 text-xs">
                            Kaiten AI Review Platform - Empowering businesses with cutting-edge AI technology
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
