
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    // Mock functionality as i18next might not be fully set up in this demo
    // In a real app, this would use the useTranslation hook
    const currentLang = localStorage.getItem('language') || 'fr';

    const toggleLanguage = () => {
        const newLang = currentLang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('language', newLang);
        window.location.reload(); // Simple reload to simulate language switch
    };

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            title="Changer la langue / Switch Language"
        >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{currentLang}</span>
        </button>
    );
};

export default LanguageSwitcher;
