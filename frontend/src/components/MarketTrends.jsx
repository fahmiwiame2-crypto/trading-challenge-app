import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { TrendingUp, TrendingDown, LayoutGrid, RefreshCw } from 'lucide-react';

const MarketTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await api.get('/api/trading/market-data/trends');
                setTrends(response.data);
            } catch (error) {
                console.error("Error fetching market trends:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
        const interval = setInterval(fetchTrends, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const getIcon = (item) => {
        if (item.category === 'Crypto') return '₿';
        if (item.category === 'Forex') return item.symbol === 'XAU' ? '📀' : '€';
        if (item.category === 'BVC') return '🇲🇦';
        return '📈';
    };

    return (
        <div className="bg-[#0a0f1a]/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-4 h-full flex flex-col shadow-lg shadow-cyan-900/20">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center">
                    <LayoutGrid className="w-5 h-5 text-cyan-400 mr-2" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tendances Marché</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold flex items-center border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                        LIVE
                    </span>
                </div>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                {loading && trends.length === 0 ? (
                    // Skeleton Loader
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                                <div className="space-y-2">
                                    <div className="w-12 h-3 bg-white/10 rounded"></div>
                                    <div className="w-20 h-2 bg-white/10 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-col items-end">
                                <div className="w-16 h-3 bg-white/10 rounded"></div>
                                <div className="w-8 h-2 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : trends.map((item, index) => (
                    <div
                        key={item.symbol}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/5 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl w-8 h-8 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                                {getIcon(item)}
                            </span>
                            <div>
                                <p className="text-white font-bold text-sm">{item.symbol}</p>
                                <p className="text-slate-400 text-[10px]">{item.name}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-white font-mono font-bold text-sm">
                                {item.category === 'Forex' && item.symbol !== 'XAU' ? '' : '$'}
                                {item.price.toLocaleString('en-US', { minimumFractionDigits: item.category === 'Forex' ? 4 : 2, maximumFractionDigits: item.category === 'Forex' ? 4 : 2 })}
                                {item.category === 'Forex' && item.symbol !== 'XAU' ? '' : ''}
                            </p>
                            <p className={`text-[10px] font-bold flex items-center justify-end ${item.change >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 shrink-0">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Flux multi-marchés synchronisé</span>
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.3);
                    border-radius: 10px;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MarketTrends;
