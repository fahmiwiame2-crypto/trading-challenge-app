import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TiltCard from '../components/ui/TiltCard';
import api from '../api/api';
import Loader from '../components/Loader';
import { Trophy, Medal, User, Award, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
    const [traders, setTraders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/api/leaderboard');
                setTraders(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                // Fallback mock data
                setTraders([
                    { rank: 1, username: 'CryptoKing', profit: 45.2, trades: 124, closed_trades: 120, status: 'PASSED', total_pnl: 22600 },
                    { rank: 2, username: 'AtlasTrader', profit: 32.8, trades: 89, closed_trades: 85, status: 'ACTIVE', total_pnl: 16400 },
                    { rank: 3, username: 'WhaleHunter', profit: 28.5, trades: 210, closed_trades: 200, status: 'PASSED', total_pnl: 14250 },
                    { rank: 4, username: 'MarketMaster', profit: 25.3, trades: 156, closed_trades: 150, status: 'ACTIVE', total_pnl: 12650 },
                    { rank: 5, username: 'TradingPro', profit: 22.1, trades: 98, closed_trades: 95, status: 'PASSED', total_pnl: 11050 },
                    { rank: 6, username: 'BullRun', profit: 19.8, trades: 134, closed_trades: 130, status: 'ACTIVE', total_pnl: 9900 },
                    { rank: 7, username: 'DiamondHands', profit: 17.5, trades: 87, closed_trades: 80, status: 'ACTIVE', total_pnl: 8750 },
                    { rank: 8, username: 'MoonShot', profit: 15.2, trades: 112, closed_trades: 108, status: 'PASSED', total_pnl: 7600 },
                    { rank: 9, username: 'ChartWizard', profit: 13.9, trades: 145, closed_trades: 140, status: 'ACTIVE', total_pnl: 6950 },
                    { rank: 10, username: 'AlphaSeeker', profit: 12.4, trades: 76, closed_trades: 72, status: 'ACTIVE', total_pnl: 6200 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-amber-400" />;
        if (index === 1) return <Medal className="w-6 h-6 text-slate-300" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="text-slate-500 font-bold">#{index + 1}</span>;
    };

    return (
        <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                                <Trophy className="w-4 h-4 text-cyan-400 mr-2" />
                                <span className="text-sm text-cyan-300 font-medium">Classement des Meilleurs Traders</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                Top 10 Traders
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Les meilleurs performers de TradeSense AI
                            </p>
                        </div>

                        {loading ? (
                            <Loader />
                        ) : (
                            <TiltCard className="glass-glow overflow-hidden" tiltAmount={3} scale={1.01}>
                                {/* Top 3 Podium */}
                                <div className="grid grid-cols-3 gap-4 p-8 bg-gradient-to-b from-cyan-500/10 to-transparent border-b border-white/10">
                                    {/* 2nd Place */}
                                    <div className="text-center pt-8">
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-slate-500/20">
                                            <Medal className="w-10 h-10 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-foreground mb-1">{traders[1]?.username}</p>
                                        <p className="text-emerald-400 text-xl font-bold">+{traders[1]?.profit}%</p>
                                        <p className="text-muted-foreground text-sm">{traders[1]?.trades} trades</p>
                                    </div>

                                    {/* 1st Place */}
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-amber-500/50 animate-pulse">
                                            <Trophy className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full mb-2">
                                            <span className="text-amber-400 text-xs font-bold">👑 CHAMPION</span>
                                        </div>
                                        <p className="text-3xl font-bold text-foreground mb-1">{traders[0]?.username}</p>
                                        <p className="text-emerald-400 text-2xl font-bold">+{traders[0]?.profit}%</p>
                                        <p className="text-muted-foreground text-sm">{traders[0]?.trades} trades</p>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="text-center pt-12">
                                        <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                            <Medal className="w-10 h-10 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-foreground mb-1">{traders[2]?.username}</p>
                                        <p className="text-emerald-400 text-xl font-bold">+{traders[2]?.profit}%</p>
                                        <p className="text-muted-foreground text-sm">{traders[2]?.trades} trades</p>
                                    </div>
                                </div>

                                {/* Leaderboard Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">Rang</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">Trader</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">Profit %</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">Trades</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {traders.map((trader, index) => (
                                                <tr
                                                    key={index}
                                                    className={`hover:bg-cyan-500/5 transition-colors ${index < 3 ? 'bg-cyan-500/5' : ''
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {getRankIcon(index)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="text-white font-bold">{trader.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
                                                            <span className="text-emerald-400 font-bold text-lg">+{trader.profit}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-slate-300">{trader.trades}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${trader.status === 'PASSED'
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-cyan-500/20 text-cyan-400'
                                                            }`}>
                                                            {trader.status === 'PASSED' ? '✓ PASSED' : '⚡ ACTIVE'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="p-6 bg-cyan-500/5 border-t border-white/10 text-center">
                                    <p className="text-slate-400 text-sm">
                                        Classement mis à jour en temps réel • Rejoignez le Top 10!
                                    </p>
                                </div>
                            </TiltCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
