import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TiltCard from '../components/ui/TiltCard';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../api/api';
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, Target, Activity, Clock, Calendar, BarChart } from 'lucide-react';

const Overview = () => {
    const { user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        console.log("Overview mounted. User:", user);
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        const identifier = user?.username || user?.email;
        console.log("Fetching stats for:", identifier);
        if (!identifier) return;
        try {
            const response = await api.get('/api/challenge', {
                params: { email: identifier }
            });
            console.log("Stats received:", response.data);
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        if (user) fetchStats();
        const interval = setInterval(() => {
            if (user) fetchStats();
        }, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const performanceMetrics = [
        { label: 'Nombre de Trades', value: stats?.trades?.length || 0, icon: BarChart, color: 'text-cyan-400' },
        { label: 'Taux de Réussite', value: `${stats?.win_rate || 0}%`, icon: Target, color: 'text-blue-400' },
        { label: 'Meilleur Trade', value: formatPrice(stats?.best_trade || 0), icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Moyenne Trade', value: formatPrice(stats?.avg_trade || 0), icon: Activity, color: 'text-cyan-400' },
    ];

    const weeklyPerformance = stats?.weekly_performance || [
        { day: 'Lun', profit: 0, trades: 0 },
        { day: 'Mar', profit: 0, trades: 0 },
        { day: 'Mer', profit: 0, trades: 0 },
        { day: 'Jeu', profit: 0, trades: 0 },
        { day: 'Ven', profit: 0, trades: 0 },
        { day: 'Sam', profit: 0, trades: 0 },
        { day: 'Dim', profit: 0, trades: 0 },
    ];

    return (
        <div className="flex h-screen bg-transparent text-foreground overflow-hidden selection:bg-cyan-500/30">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64 bg-transparent">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-700/50">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <LayoutDashboard className="w-8 h-8 text-cyan-400 mr-3" />
                                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                            Vue d'Ensemble
                                        </h1>
                                    </div>
                                    <p className="text-muted-foreground text-lg">Re-bonjour, <span className="text-foreground font-bold">{user?.username || 'Trader'}</span> 👋</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Statut Challenge</p>
                                    <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border shadow-lg inline-flex items-center ${stats?.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' : 'bg-red-500/10 border-red-500/30 text-red-400'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${stats?.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                                        {stats?.status === 'ACTIVE' ? 'ACTIF' : stats?.status || 'ACTIF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Stats - Big Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <TiltCard className="glass-glow p-6 relative group" tiltAmount={8} scale={1.02}>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Solde Total</p>
                                        <h3 className="text-3xl font-mono font-bold text-white tracking-tight">
                                            {formatPrice(stats?.balance || 0)}
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                        <span className="text-2xl font-bold text-cyan-400">{currency.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs font-bold text-slate-500 relative z-10">
                                    <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded mr-2">CAPITAL</span>
                                    <span>{formatPrice(stats?.initial_capital || 5000)}</span>
                                </div>
                            </TiltCard>

                            <TiltCard className="glass-glow rounded-2xl p-6 relative group" tiltAmount={8} scale={1.02}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Profit Total</p>
                                        <h3 className={`text-3xl font-mono font-bold tracking-tight ${stats?.profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {stats?.profit >= 0 ? '+' : ''}{formatPrice(stats?.profit || 0)}
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex items-center text-xs font-bold relative z-10">
                                    <span className={`px-2 py-0.5 rounded mr-2 ${stats?.profit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {stats?.profit_percent?.toFixed(2) || 0}%
                                    </span>
                                    <span className="text-slate-500">du capital</span>
                                </div>
                            </TiltCard>

                            <TiltCard className="glass-glow rounded-2xl p-6 relative group" tiltAmount={8} scale={1.02}>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Perte Max (DD)</p>
                                        <h3 className="text-3xl font-mono font-bold text-red-500 tracking-tight">
                                            -{Math.abs(stats?.drawdown || 0).toFixed(2)}%
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <TrendingDown className="w-6 h-6 text-red-400" />
                                    </div>
                                </div>
                                <div className="flex items-center text-xs font-bold text-slate-500 relative z-10">
                                    <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded mr-2">MAX PERMIS</span>
                                    <span>10.00%</span>
                                </div>
                            </TiltCard>

                            <TiltCard className="glass-glow rounded-2xl p-6 relative group" tiltAmount={8} scale={1.02}>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Objectif Profit</p>
                                        <h3 className={`text-3xl font-mono font-bold tracking-tight ${stats?.profit_percent >= 10 ? 'text-emerald-400' : 'text-white'}`}>
                                            {stats?.profit_percent?.toFixed(1) || 0}%
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                        <Target className="w-6 h-6 text-cyan-400" />
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(((stats?.profit_percent || 0) / 10) * 100, 100)}%` }}></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-500">
                                    <span>ACTUEL</span>
                                    <span>CIBLE 10%</span>
                                </div>
                            </TiltCard>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {performanceMetrics.map((metric, index) => {
                                const Icon = metric.icon;
                                return (
                                    <div key={index} className="glass-glow rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 ${metric.color}`} />
                                            <span className="text-slate-400 text-xs">{metric.label}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Weekly Performance Chart */}
                        <div className="glass-glow rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-cyan-400" />
                                Performance Hebdomadaire
                            </h2>
                            <div className="flex items-end justify-between h-48 gap-4">
                                {weeklyPerformance.map((day, index) => {
                                    const maxProfit = Math.max(...weeklyPerformance.map(d => Math.abs(d.profit)));
                                    const height = (Math.abs(day.profit) / maxProfit) * 100;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="w-full flex flex-col items-center justify-end h-40">
                                                <span className={`text-xs font-bold mb-1 ${day.profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                                    {formatPrice(day.profit)}
                                                </span>
                                                <div
                                                    className={`w-full rounded-t-lg transition-all ${day.profit >= 0
                                                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                                                        : 'bg-gradient-to-t from-red-600 to-red-400'
                                                        }`}
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-slate-400 text-sm mt-2">{day.day}</p>
                                            <p className="text-slate-500 text-xs">{day.trades} trades</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-glow rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <Activity className="w-6 h-6 mr-2 text-cyan-400" />
                                Activité Récente
                            </h2>
                            <div className="space-y-3">
                                {stats?.trades?.slice(0, 5).map((trade, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${trade.pnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                                                }`}>
                                                {trade.side === 'BUY' ? '📈' : '📉'}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{trade.side} {trade.ticker}</p>
                                                <p className="text-slate-400 text-sm flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(trade.time * 1000).toLocaleString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-lg ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {trade.pnl >= 0 ? '+' : ''}{formatPrice(trade.pnl)}
                                        </span>
                                    </div>
                                )) || (
                                        <p className="text-center text-slate-500 py-8">Aucune activité récente</p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Overview;
