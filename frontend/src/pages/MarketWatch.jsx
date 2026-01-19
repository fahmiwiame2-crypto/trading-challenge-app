import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TradingChart from '../components/TradingChart';
import MarketWatchlist from '../components/MarketWatchlist';
import EconomicCalendar from '../components/EconomicCalendar';
import MarketHeatmap from '../components/MarketHeatmap';
import FlashLive from '../components/FlashLive';
import MarketTrends from '../components/MarketTrends';
import api from '../api/api';
import { TrendingUp, TrendingDown, Activity, Brain, Globe, Clock } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

const MarketWatch = () => {
    const [ticker, setTicker] = useState('BTC-USD');
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Crypto');
    const [marketStats, setMarketStats] = useState([
        { label: 'Market Cap', value: '...', change: '0.0%', positive: true },
        { label: '24h Volume', value: '...', change: '0.0%', positive: true },
        { label: 'BTC Dominance', value: '...', change: '0.0%', positive: true },
        { label: 'Fear & Greed', value: '...', label2: '...', positive: true },
    ]);

    const chartFilters = {
        'Crypto': ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD'],
        'BVC': ['IAM', 'ATW', 'BCP', 'ADH'],
        'Forex': ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'GC=F'],
        'Stocks': ['AAPL', 'TSLA', 'NVDA', 'MSFT']
    };

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        setTicker(chartFilters[cat][0]);
    };

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const response = await api.get('/api/trading/market-data/global-stats');
                setMarketStats(response.data);
            } catch (error) {
                console.error("Error fetching global stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalStats();
        const interval = setInterval(fetchGlobalStats, 300000); // 5 min
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex bg-transparent min-h-screen text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64">
                <Navbar />

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Header - Quantum Glass Style */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-900/20">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Market Watch
                                    </h1>
                                    <p className="text-slate-400 text-sm">Analyses techniques et tendances en temps réel.</p>
                                </div>
                            </div>
                        </div>


                        {/* Top Stats Row - Quantum Glass Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {marketStats.map((stat, index) => (
                                <div key={index} className="glass-glow bg-white/[0.02] border border-white/5 p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                                    {/* LIVE PULSE INDICATOR */}
                                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                        <span className="text-[8px] font-black text-cyan-400/80 tracking-tighter uppercase italic">Live</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                                        <Activity className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-white font-bold text-xl block tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</span>
                                            {stat.label2 && <span className="text-[10px] text-slate-500 font-medium">{stat.label2}</span>}
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center ${stat.positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-pink-500/10 text-pink-500 border border-pink-500/20'}`}>
                                            {stat.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ADVANCED CHART FILTERS - Quantum Glass Style */}
                        <div className="flex flex-wrap items-center glass-glow p-2 rounded-2xl w-full md:w-fit gap-2">
                            {/* Categories */}
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                {Object.keys(chartFilters).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${activeCategory === cat
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>

                            {/* Specific Tickers */}
                            <div className="flex flex-wrap gap-2">
                                {chartFilters[activeCategory].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTicker(t)}
                                        className={`px-4 py-2 text-[10px] font-bold rounded-lg border transition-all duration-200 ${ticker === t
                                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/5'
                                            }`}
                                    >
                                        {t.replace('=X', '').replace('-USD', '')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CHART SECTION - Quantum Glass Style */}
                        <div className="h-[600px] glass-glow rounded-2xl p-1 relative overflow-hidden shadow-2xl group">
                            {/* Background Blob */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-600/10 transition-colors duration-1000"></div>

                            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-cyan-500/20 pointer-events-none">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">Live: {ticker.replace('=X', '')}</span>
                            </div>
                            <TradingChart ticker={ticker} />
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Heatmap */}
                            <div className="h-[450px]">
                                <MarketHeatmap />
                            </div>

                            {/* Crypto Trends */}
                            <div className="h-[450px]">
                                <MarketTrends />
                            </div>

                            {/* Watchlist */}
                            <div className="h-[450px]">
                                <MarketWatchlist onTickerChange={setTicker} currentTicker={ticker} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketWatch;
