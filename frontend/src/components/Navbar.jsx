import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, User, LogOut, BarChart2, Shield, Globe } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLanguageMenu = () => {
        setIsLangMenuOpen(!isLangMenuOpen);
    };

    const selectLanguage = (lang) => {
        setLanguage(lang);
        setIsLangMenuOpen(false);
    };

    return (
        <nav className="bg-[#0a0f1a] backdrop-blur-lg border-b border-cyan-900/30 text-foreground sticky top-0 z-50 shadow-lg shadow-cyan-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 font-bold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
                            TradeSense<span className="text-white">AI</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/pricing" className="hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors px-3 py-2 rounded-md text-sm font-medium">{t('nav_pricing')}</Link>
                                <Link to="/leaderboard" className="hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors px-3 py-2 rounded-md text-sm font-medium">{t('nav_leaderboard')}</Link>
                                {user && (
                                    <div className="hidden"></div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            {/* Language Switcher */}
                            {/* Language Switcher Dropdown */}
                            <div className="relative ml-4">
                                <button
                                    onClick={() => toggleLanguageMenu()}
                                    className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-cyan-500/10 flex items-center font-bold transition-all"
                                >
                                    <Globe className="w-5 h-5 mr-1" />
                                    {language === 'fr' ? 'FR' : language === 'en' ? 'EN' : 'AR'}
                                </button>

                                {isLangMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-[#0a0f1a] border border-cyan-500/20 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <button
                                            onClick={() => selectLanguage('fr')}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-cyan-500/10 flex items-center ${language === 'fr' ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-300'}`}
                                        >
                                            🇫🇷 Français
                                        </button>
                                        <button
                                            onClick={() => selectLanguage('en')}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-cyan-500/10 flex items-center ${language === 'en' ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-300'}`}
                                        >
                                            🇬🇧 English
                                        </button>
                                        <button
                                            onClick={() => selectLanguage('ar')}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-cyan-500/10 flex items-center ${language === 'ar' ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-300'}`}
                                        >
                                            🇲🇦 العربية
                                        </button>
                                    </div>
                                )}
                            </div>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/dashboard" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-md text-sm font-bold shadow-lg shadow-cyan-500/25 flex items-center transition-all transform hover:scale-105">
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        {t('nav_dashboard')}
                                    </Link>
                                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title={t('nav_logout')}>
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-slate-300 hover:text-white hover:bg-cyan-500/5 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav_login')}</Link>
                                    <Link to="/register" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all">
                                        {t('nav_register')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-cyan-500/10 inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white hover:bg-cyan-500/20 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0a0f1a] border-b border-cyan-500/20">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-cyan-500/10">{t('nav_pricing')}</Link>
                        <Link to="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-cyan-500/10">{t('nav_leaderboard')}</Link>

                        <div className="px-3 py-2">
                            <div className="flex items-center text-slate-400 mb-2">
                                <Globe className="w-5 h-5 mr-2" />
                                <span className="font-medium">Langue</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => selectLanguage('fr')}
                                    className={`text-center py-2 rounded-md text-sm font-bold ${language === 'fr' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => selectLanguage('en')}
                                    className={`text-center py-2 rounded-md text-sm font-bold ${language === 'en' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => selectLanguage('ar')}
                                    className={`text-center py-2 rounded-md text-sm font-bold ${language === 'ar' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    AR
                                </button>
                            </div>
                        </div>

                        {user ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-cyan-500/20">{t('nav_dashboard')}</Link>
                                <div className="hidden"></div>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-red-500/10">{t('nav_logout')}</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-cyan-500/10">{t('nav_login')}</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-cyan-500/10">{t('nav_register')}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
