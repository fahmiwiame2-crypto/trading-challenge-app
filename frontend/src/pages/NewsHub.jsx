import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Sidebar from '../components/Sidebar';
import { Newspaper, Calendar, Clock, RefreshCw, TrendingUp, TrendingDown, Minus, Zap, Globe, Sparkles } from 'lucide-react';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end">
            <div className="text-3xl font-mono font-bold text-cyan-400">
                {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
};

const NewsHub = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [news, setNews] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [aiSummary, setAiSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllData = async () => {
        setRefreshing(true);
        try {
            const [newsRes, calendarRes, summaryRes] = await Promise.all([
                api.get('/api/news/market'),
                api.get('/api/news/calendar'),
                api.get('/api/news/summary')
            ]);

            setNews(newsRes.data || []);
            setCalendar(calendarRes.data || []);
            setAiSummary(summaryRes.data || null);
        } catch (error) {
            console.error("Error fetching news hub data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 60000); // Auto-refresh every minute
        return () => clearInterval(interval);
    }, []);

    const filteredNews = activeTab === 'ALL'
        ? news
        : news.filter(item => item.category === activeTab);

    const getSentimentColor = (sentiment) => {
        if (sentiment === 'POSITIVE') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (sentiment === 'NEGATIVE') return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    };

    const getSentimentIcon = (sentiment) => {
        if (sentiment === 'POSITIVE') return <TrendingUp className="w-3 h-3 mr-1" />;
        if (sentiment === 'NEGATIVE') return <TrendingDown className="w-3 h-3 mr-1" />;
        return <Minus className="w-3 h-3 mr-1" />;
    };

    return (
        <div className="flex bg-transparent min-h-screen text-white font-sans selection:bg-cyan-500/30">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-900/20">
                            <Newspaper className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Actualités en Direct
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Restez informé avec les actualités financières en temps réel.
                            </p>
                        </div>
                    </div>
                    <LiveClock />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Globe, label: "Real-time financial news", color: "text-cyan-400" },
                        { icon: Sparkles, label: "AI-generated market summaries", color: "text-purple-400" },
                        { icon: Calendar, label: "Economic event alerts", color: "text-blue-400" },
                        { icon: Zap, label: "Always stay ahead", color: "text-emerald-400" }
                    ].map((feature, i) => (
                        <div key={i} className="glass-glow bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-3">
                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">{feature.label}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
                    {/* COLUMN 1 & 2: NEWS FEED */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="glass-glow rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden group">
                            {/* Background Blob */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-600/10 transition-colors duration-1000"></div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-lg font-bold uppercase tracking-wide text-white">Dernières Actualités</h2>
                                </div>
                                <button
                                    onClick={fetchAllData}
                                    className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${refreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none relative z-10">
                                {['ALL', 'STOCKS', 'CRYPTO', 'FOREX', 'BVC'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${activeTab === tab
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                            : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tab === 'ALL' ? 'Tous' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 relative z-10">
                                {loading ? (
                                    <div className="text-center py-20 text-slate-500 animate-pulse">Chargement des actualités...</div>
                                ) : filteredNews.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500">Aucune actualité trouvée.</div>
                                ) : (
                                    filteredNews.map((item, idx) => (
                                        <div key={idx} className="group/item relative p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.category === 'CRYPTO' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                                        item.category === 'FOREX' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                                                            item.category === 'BVC' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                                                'text-purple-400 bg-purple-500/10 border-purple-500/20'
                                                        }`}>
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs font-bold text-cyan-500">{item.source}</span>
                                                    <span className="text-xs text-slate-500">• {item.time}</span>
                                                </div>
                                                <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSentimentColor(item.sentiment)}`}>
                                                    {getSentimentIcon(item.sentiment)}
                                                    {item.sentiment}
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-medium text-slate-200 group-hover/item:text-white transition-colors leading-relaxed">
                                                {item.title}
                                            </h3>
                                            {/* Click effect */}
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3: AI & CALENDAR */}
                    <div className="flex flex-col gap-6">
                        {/* AI Summary */}
                        <div className="glass-glow rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Résumé IA</h2>
                            </div>

                            {loading || !aiSummary ? (
                                <div className="h-40 flex items-center justify-center text-slate-500 animate-pulse text-xs">Analyse du marché en cours...</div>
                            ) : (
                                <div className="relative z-10 space-y-4">
                                    <div className="text-sm text-slate-300 leading-relaxed font-light">
                                        {aiSummary.content.map((points, i) => (
                                            <p key={i} className="mb-2 last:mb-0 border-l-2 border-cyan-500/30 pl-3">
                                                {points}
                                            </p>
                                        ))}
                                    </div>

                                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Générer un résumé
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Eco Calendar */}
                        <div className="glass-glow rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Calendrier Éco</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {calendar.map((event, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-400">{event.time}</span>
                                                {event.impact === 'HIGH' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                            </div>
                                            <div className="text-xs font-medium text-slate-200">{event.title}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-[#0f0716] ${event.impact === 'HIGH' ? 'bg-amber-400' :
                                                event.impact === 'MEDIUM' ? 'bg-slate-300' : 'bg-slate-500'
                                                }`}>
                                                {event.impact}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsHub;
