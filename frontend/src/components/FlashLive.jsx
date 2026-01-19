import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, AlertCircle, Clock, X, RefreshCw } from 'lucide-react';
import api from '../api/api';

const FlashLive = () => {
    const [news, setNews] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);

    // Category icons mapping
    const getCategoryIcon = (category) => {
        const icons = {
            'CRYPTO': '🚀',
            'BVC': '📊',
            'FOREX': '💱',
            'STOCKS': '📈',
            'Crypto': '🚀',
            'BVC': '📊',
            'Forex': '💱',
            'Stocks': '📈',
            'Eco': '🏦',
            'Commodities': '🥇'
        };
        return icons[category] || '📰';
    };

    // Simulate additional live news for variety
    const liveNewsTemplates = [
        { title: "Bitcoin dépasse une résistance clé", description: "Le BTC montre des signes de force technique", category: "CRYPTO", impact: "high" },
        { title: "Le MASI gagne du terrain", description: "Les valeurs bancaires tirent l'indice vers le haut", category: "BVC", impact: "medium" },
        { title: "EUR/USD en consolidation", description: "Les traders attendent les annonces de la BCE", category: "FOREX", impact: "medium" },
        { title: "Ethereum atteint un nouveau ATH", description: "L'ETH surperforme le marché crypto", category: "CRYPTO", impact: "high" },
        { title: "IAM annonce un partenariat stratégique", description: "Expansion vers l'Afrique de l'Ouest", category: "BVC", impact: "high" },
        { title: "Le Gold franchit les 2100$/oz", description: "Les investisseurs cherchent des valeurs refuges", category: "Commodities", impact: "high" },
        { title: "La Fed maintient sa politique", description: "Pas de changement de taux prévu", category: "Eco", impact: "high" },
        { title: "Solana en hausse de 15%", description: "Forte adoption DeFi sur le réseau", category: "CRYPTO", impact: "medium" },
    ];

    // Fetch news from backend
    const fetchNews = async () => {
        try {
            const response = await api.get('/api/news/market');
            const backendNews = response.data.map((item, idx) => ({
                id: item.id || idx,
                title: item.title,
                description: item.source ? `Source: ${item.source}` : 'Actualité du marché',
                category: item.category || 'BVC',
                time: item.time || 'il y a quelques minutes',
                impact: item.sentiment === 'POSITIVE' ? 'high' : item.sentiment === 'NEGATIVE' ? 'high' : 'medium',
                icon: getCategoryIcon(item.category),
                sentiment: item.sentiment,
                link: item.link
            }));
            setNews(backendNews);
        } catch (error) {
            console.error("Error fetching news:", error);
            // Fallback to initial simulated data
            setNews([
                { id: 1, title: "Bitcoin dépasse les 97K$", description: "Le BTC rallye, hausse confirmée ?", category: "CRYPTO", time: "à l'instant", impact: "high", icon: "🚀" },
                { id: 2, title: "Maroc Telecom (IAM) résultats records", description: "Hausse de 15% du chiffre d'affaires", category: "BVC", time: "il y a 2 min", impact: "medium", icon: "📊" },
                { id: 3, title: "EUR/USD en forte volatilité", description: "Décision BCE attendue aujourd'hui", category: "FOREX", time: "il y a 5 min", impact: "high", icon: "💱" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();

        // Simulate Live Feed updates
        const interval = setInterval(() => {
            const randomTemplate = liveNewsTemplates[Math.floor(Math.random() * liveNewsTemplates.length)];
            const newItem = {
                ...randomTemplate,
                id: Date.now(),
                time: "à l'instant",
                icon: getCategoryIcon(randomTemplate.category)
            };

            setNews(prev => {
                const updated = [newItem, ...prev].slice(0, 12); // Keep last 12
                // Update times for older news
                return updated.map((item, idx) => ({
                    ...item,
                    time: idx === 0 ? "à l'instant" : idx === 1 ? "il y a 1 min" : idx < 5 ? `il y a ${idx * 2} min` : item.time
                }));
            });
        }, 12000); // New news every 12 seconds

        return () => clearInterval(interval);
    }, []);

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'high': return 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10';
            case 'medium': return 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10';
            default: return 'border-slate-500/30 bg-slate-500/5';
        }
    };

    return (
        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center">
                    <Newspaper className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Flash Live</h3>
                </div>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded-full text-[10px] font-bold flex items-center border border-pink-500/20">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                    LIVE
                </span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {news.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedNews(item)}
                        className={`p-3 rounded-xl border ${getImpactColor(item.impact)} transition-all cursor-pointer group relative overflow-hidden`}
                        style={{
                            animation: index === 0 ? 'slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                        }}
                    >
                        {/* Highlight for new items */}
                        {index === 0 && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-500"></div>
                        )}

                        <div className="flex items-start gap-3">
                            <span className="text-xl shrink-0 mt-0.5 filter drop-shadow-md">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-white font-bold text-[11px] leading-tight group-hover:text-pink-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <span className="text-[9px] text-slate-500 whitespace-nowrap ml-2 flex items-center shrink-0">
                                        <Clock className="w-2.5 h-2.5 mr-1" />
                                        {item.time}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-[10px] truncate">{item.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 ml-9">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${item.category === 'Crypto' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : item.category === 'BVC' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                {item.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* News Detail Modal */}
            {selectedNews && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedNews(null)}>
                    <div className="bg-[#1a0b2e] border border-purple-500/30 rounded-2xl max-w-md w-full p-6 relative shadow-2xl shadow-purple-900/40 transform scale-100" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNews(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center mb-4">
                            <span className="text-3xl mr-3">{selectedNews.icon}</span>
                            <div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border mb-1 inline-block ${selectedNews.category === 'Crypto' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                    {selectedNews.category}
                                </span>
                                <h2 className="text-lg font-bold text-white leading-tight">
                                    {selectedNews.title}
                                </h2>
                            </div>
                        </div>

                        <div className="bg-purple-500/5 rounded-xl p-3 border border-purple-500/10 mb-4">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                {selectedNews.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> Publié: {selectedNews.time}
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            {selectedNews.link && (
                                <a
                                    href={selectedNews.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/20 flex items-center"
                                >
                                    Lire l'article <TrendingUp className="w-3 h-3 ml-2" />
                                </a>
                            )}
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-xs font-bold transition-colors border border-white/10"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(168, 85, 247, 0.3);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(236, 72, 153, 0.5);
                }
            `}</style>
        </div>
    );
};

export default FlashLive;
