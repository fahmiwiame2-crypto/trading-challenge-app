import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const ChallengeStats = ({ stats: propStats }) => {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const [fetchedStats, setFetchedStats] = useState(null);
    const [loading, setLoading] = useState(!propStats);

    useEffect(() => {
        if (propStats) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                // GET /api/challenge?email=...
                const response = await api.get('/api/challenge', {
                    params: { email: user?.email }
                });
                setFetchedStats(response.data);
            } catch (error) {
                console.error("Error fetching challenge stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchStats();

        // Auto refresh stats every 5s to see updates
        const interval = setInterval(() => {
            if (user) fetchStats();
        }, 5000);
        return () => clearInterval(interval);

    }, [user, propStats]);

    if (loading && !propStats) return <Loader />;

    // Use propStats if available, otherwise fetchedStats, otherwise default
    const data = propStats || fetchedStats || {
        balance: 100000,
        equity: 100000,
        profit: 0,
        profit_percent: 0,
        drawdown: 0,
        status: 'ACTIVE'
    };

    return (
        <div className="glass-glow rounded-2xl p-6 relative group">
            {/* Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-600/20 rounded-full blur-3xl group-hover:bg-cyan-600/30 transition-all duration-700"></div>

            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-6 relative z-10">{t('stats_title')}</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {/* Balance */}
                <div className="bg-[#0a0f1a]/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all group/card">
                    <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover/card:text-cyan-300 transition-colors">{t('stats_balance')}</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatPrice(data.balance)}</p>
                </div>

                {/* Equity */}
                <div className="bg-[#0a0f1a]/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all group/card">
                    <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover/card:text-cyan-300 transition-colors">{t('stats_equity')}</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatPrice(data.equity)}</p>
                </div>

                {/* Profit */}
                <div className="bg-[#0a0f1a]/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all group/card">
                    <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover/card:text-cyan-300 transition-colors">{t('stats_profit')}</p>
                    <p className={`text-xl font-bold flex items-center ${data.profit_percent >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {data.profit_percent >= 0 ? '+' : ''}{typeof data.profit_percent === 'number' ? data.profit_percent.toFixed(2) : data.profit_percent}%
                    </p>
                </div>

                {/* Drawdown */}
                <div className="bg-[#0a0f1a]/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all group/card">
                    <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover/card:text-cyan-300 transition-colors">{t('stats_drawdown')}</p>
                    <p className="text-xl font-bold text-red-500">-{data.drawdown}%</p>
                </div>
            </div>

            <div className="mt-6 relative z-10 bg-[#0a0f1a]/40 p-3 rounded-xl border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-cyan-300/60 text-[10px] font-bold uppercase tracking-widest px-1">{t('stats_account_status')}</p>
                    <div className={`px-3 py-0.5 rounded text-[10px] font-bold border ${data.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        data.status === 'FAILED' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                            'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}>
                        {data.status === 'ACTIVE' ? t('status_active') :
                            data.status === 'FAILED' ? t('status_failed') :
                                data.status === 'PASSED' ? t('status_passed') :
                                    data.status === 'PENDING' ? t('status_pending') :
                                        data.status}
                    </div>
                </div>
                {/* Progress Bar Visual */}
                <div className="w-full bg-cyan-500/10 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${data.status === 'FAILED' ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                        style={{ width: data.status === 'FAILED' ? '100%' : `${Math.min(100, (data.profit + 10) * 5)}%` }} // Mock progress based on profit
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeStats;
