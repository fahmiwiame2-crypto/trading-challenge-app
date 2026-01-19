import React, { useState, useEffect } from 'react';
import { Search, X, LayoutDashboard, BarChart2, BookOpen, Trophy, Settings, LogOut, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Toggle with Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const actions = [
        { id: 'dashboard', label: 'Aller au Dashboard', icon: LayoutDashboard, path: '/dashboard', category: 'Navigation' },
        { id: 'trading', label: 'Trading Terminal', icon: BarChart2, path: '/trading', category: 'Navigation' },
        { id: 'academy', label: 'Prop Academy', icon: BookOpen, path: '/academy', category: 'Education' },
        { id: 'challenges', label: 'Mes Challenges', icon: Trophy, path: '/challenges', category: 'Compte' },
        { id: 'billing', label: 'Facturation & Plans', icon: CreditCard, path: '/pricing', category: 'Compte' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings', category: 'Système' },
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (path) => {
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#1a0b2e] border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Search Input */}
                <div className="flex items-center border-b border-purple-500/20 px-4 py-3">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Rechercher une commande... (Ctrl+K)"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {filteredActions.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            Aucun résultat trouvé.
                        </div>
                    ) : (
                        filteredActions.map((action, idx) => (
                            <button
                                key={action.id}
                                onClick={() => handleSelect(action.path)}
                                className="w-full flex items-center px-3 py-3 rounded-lg hover:bg-purple-600/20 group transition-all text-left"
                            >
                                <div className="bg-white/5 p-2 rounded-md mr-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <action.icon className="w-4 h-4 text-slate-300 group-hover:text-white" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-slate-200 group-hover:text-white font-medium block">
                                        {action.label}
                                    </span>
                                    <span className="text-xs text-slate-500 group-hover:text-purple-300">
                                        {action.category}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-600 bg-black/40 px-2 py-1 rounded hidden group-hover:inline-block">
                                    Entrée
                                </span>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#0f0716] px-4 py-2 border-t border-purple-500/20 flex justify-between items-center text-[10px] text-slate-500">
                    <span>TradeSense Command</span>
                    <div className="flex gap-2">
                        <span className="bg-white/10 px-1 rounded">↑↓</span>
                        <span>naviguer</span>
                        <span className="bg-white/10 px-1 rounded">esc</span>
                        <span>fermer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
