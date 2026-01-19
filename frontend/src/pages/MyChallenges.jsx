import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TiltCard from '../components/ui/TiltCard';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../api/api';
import { Target, TrendingUp, Award, Clock, CheckCircle, XCircle, Play, AlertTriangle } from 'lucide-react';

const MyChallenges = () => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.email) return;
            try {
                const response = await api.get('/api/challenge', {
                    params: { email: user.email }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch challenge stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
            const interval = setInterval(fetchStats, 30000); // Live updates
            return () => clearInterval(interval);
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PASSED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'FAILED': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
            case 'ACTIVE': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            case 'REPLACED': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex h-screen bg-transparent text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64 bg-transparent">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-cyan-700/50">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header - Quantum Glass Style */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-900/20">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Mes Challenges
                                    </h1>
                                    <p className="text-slate-400 text-sm">Suivez vos challenges de trading et votre progression</p>
                                </div>
                            </div>
                        </div>

                        {/* Active Challenges */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Play className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Challenge Actif</h2>
                            </div>

                            {stats && stats.active_challenge ? (
                                <TiltCard className="glass-glow p-8 relative group hover:border-cyan-500/40 transition-all shadow-2xl shadow-cyan-900/10" tiltAmount={6} scale={1.01}>
                                    {/* Background Blob */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-600/10 transition-colors duration-1000"></div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-3xl font-bold text-white">{stats.active_challenge.plan_name || 'Challenge'}</h3>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center border ${getStatusColor(stats.active_challenge.challenge_status)}`}>
                                                    <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${stats.active_challenge.challenge_status === 'active' ? 'bg-cyan-400' : 'bg-gray-400'}`}></span>
                                                    {stats.active_challenge.challenge_status === 'active' ? 'EN COURS' : stats.active_challenge.challenge_status}
                                                </span>
                                            </div>
                                            <p className="text-cyan-300 font-mono text-xl">{formatPrice(stats.initial_capital)} <span className="text-slate-400 text-sm font-sans">Capital Initial</span></p>
                                        </div>
                                        <div className="mt-4 md:mt-0 text-right">
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Solde Actuel</p>
                                            <p className="text-4xl font-mono font-bold text-white tracking-tight">
                                                {formatPrice(stats.balance)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative z-10 hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Objectif Profit</span>
                                                <Target className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <p className={`text-2xl font-bold ${stats.profit_percent >= stats.risk_params.profit_target ? 'text-emerald-400' : 'text-white'}`}>
                                                    {Math.abs(stats.profit_percent) > 0 && Math.abs(stats.profit_percent) < 0.01
                                                        ? stats.profit_percent?.toFixed(4)
                                                        : stats.profit_percent?.toFixed(2)}%
                                                </p>
                                                <p className="text-xs text-slate-400 font-bold mb-1">sur {stats.risk_params.profit_target}%</p>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                                                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((stats.profit_percent || 0) / stats.risk_params.profit_target) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative z-10 hover:border-pink-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Perte Max ({stats.risk_params.max_total_loss}%)</span>
                                                <AlertTriangle className="w-5 h-5 text-pink-500" />
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <p className="text-2xl font-bold text-pink-500">
                                                    {Math.abs(stats.drawdown) > 0 && Math.abs(stats.drawdown) < 0.01
                                                        ? Math.abs(stats.drawdown).toFixed(4)
                                                        : Math.abs(stats.drawdown || 0).toFixed(2)}%
                                                </p>
                                                <p className="text-xs text-slate-400 font-bold mb-1">Actuelle</p>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                                                <div className="bg-pink-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min((Math.abs(stats.drawdown || 0) / stats.risk_params.max_total_loss) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative z-10 hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Temps Restant</span>
                                                <Clock className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <p className="text-2xl font-bold text-white">Illimité</p>
                                            <p className="text-xs text-slate-400 mt-1">Pas de limite de temps</p>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative z-10 hover:border-emerald-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Profit</span>
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-emerald-400' : 'text-pink-500'}`}>
                                                {stats.profit >= 0 ? '+' : ''}{formatPrice(stats.profit)}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">Total PnL</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = '/dashboard'}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-cyan-600/20 border border-white/10 hover:border-white/20 active:scale-[0.98]">
                                        Accéder au Terminal de Trading
                                    </button>
                                </TiltCard>
                            ) : (
                                <div className="glass-glow p-10 text-center border-dashed border-2 border-cyan-500/30 relative overflow-hidden group">
                                    {/* Background Blob */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-600/10 transition-colors duration-1000"></div>

                                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-600/30 to-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 relative z-10">
                                        <Target className="w-10 h-10 text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 relative z-10">
                                        Commencez Votre Parcours de Trader
                                    </h3>
                                    <p className="text-slate-400 mb-4 max-w-md mx-auto relative z-10">
                                        Choisissez un challenge pour débloquer votre capital de trading et prouver vos compétences.
                                    </p>
                                    <div className="flex items-center justify-center gap-4 text-sm text-slate-400 mb-6 relative z-10">
                                        <span className="flex items-center"><Award className="w-4 h-4 mr-1 text-cyan-400" /> Capital jusqu'à $100K</span>
                                        <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-emerald-400" /> 80-90% Profit Split</span>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/pricing'}
                                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:shadow-cyan-600/40 text-lg relative z-10 active:scale-[0.98]">
                                        🚀 Choisir Mon Challenge
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Past Challenges */}
                        {stats?.past_challenges && stats.past_challenges.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Award className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-lg font-bold uppercase tracking-wide text-white">Historique des Challenges</h2>
                                </div>
                                <div className="space-y-4">
                                    {stats.past_challenges.map((challenge) => (
                                        <div key={challenge.id} className="glass-glow bg-white/[0.02] p-6 flex items-center justify-between hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${challenge.challenge_status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    challenge.challenge_status === 'failed' ? 'bg-pink-500/20 text-pink-500' :
                                                        'bg-slate-700 text-slate-400'
                                                    }`}>
                                                    {challenge.challenge_status === 'passed' ? <CheckCircle className="w-6 h-6" /> :
                                                        challenge.challenge_status === 'failed' ? <XCircle className="w-6 h-6" /> :
                                                            <Clock className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">{challenge.plan_name}</h3>
                                                    <p className="text-slate-400 text-sm">
                                                        {new Date(challenge.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-bold text-lg text-white">{formatPrice(challenge.initial_capital)}</p>
                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${getStatusColor(challenge.challenge_status)}`}>
                                                    {challenge.challenge_status === 'passed' ? 'RÉUSSI' :
                                                        challenge.challenge_status === 'failed' ? 'ÉCHOUÉ' :
                                                            challenge.challenge_status === 'active' ? 'EN COURS' : 'REMPLACÉ'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChallenges;
