import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { TrendingUp, TrendingDown, Eye, Search } from 'lucide-react';

const MarketWatchlist = ({ onTickerChange, currentTicker }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Crypto');

    const categories = ['Crypto', 'Forex', 'Stocks', 'BVC'];

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const response = await api.get('/api/trading/market-data/watchlist');
                setMarkets(response.data);
            } catch (error) {
                console.error("Error fetching watchlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredMarkets = markets
        .filter(group => group.category === activeCategory)
        .map(group => ({
            ...group,
            items: group.items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }));

    return (
        <div className="glass-glow p-4 flex flex-col h-full min-h-[500px]">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Surveillance Marché
                </span>
                {loading && <span className="text-[10px] text-cyan-400 animate-pulse">Live</span>}
            </h3>

            {/* Category Tabs */}
            <div className="flex bg-slate-900/40 p-1 rounded-xl mb-3 border border-white/5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 ${activeCategory === cat
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input
                    type="text"
                    placeholder={`Search ${activeCategory}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded-lg py-1.5 pl-8 pr-3 text-xs text-foreground focus:outline-none focus:border-cyan-500/30 placeholder-muted-foreground transition-all"
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-800 space-y-4">
                {loading && markets.length === 0 ? (
                    // Skeleton Loader for Watchlist
                    <div className="space-y-1">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="p-2 rounded-lg flex items-center justify-between border border-white/5 animate-pulse bg-white/5">
                                <div className="space-y-2">
                                    <div className="w-12 h-3 bg-white/10 rounded"></div>
                                    <div className="w-16 h-2 bg-white/10 rounded"></div>
                                </div>
                                <div className="space-y-2 flex flex-col items-end">
                                    <div className="w-14 h-3 bg-white/10 rounded"></div>
                                    <div className="w-10 h-2 bg-white/10 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMarkets.length > 0 ? (
                    filteredMarkets.map((group) => (
                        <div key={group.category}>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <div
                                        key={item.symbol}
                                        onClick={() => onTickerChange && onTickerChange(item.symbol)}
                                        className={`p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group
                                            ${currentTicker === item.symbol
                                                ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30'
                                                : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div>
                                            <p className={`text-xs font-bold ${currentTicker === item.symbol ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                                {item.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500">{item.symbol.replace('=X', '')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono font-medium text-slate-200">
                                                {item.price ? item.price.toFixed(item.category === 'Forex' ? 4 : 2) : '0.00'}
                                            </p>
                                            <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${item.change >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                                {item.change >= 0 ? '+' : ''}{item.change}%
                                                {item.change >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 text-xs">
                        No markets found
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketWatchlist;