import React from 'react';
import api from '../api/api';
import { useLanguage } from '../context/LanguageContext';

const MarketHeatmap = ({ data }) => {
    const { t } = useLanguage();
    const [heatmapData, setHeatmapData] = React.useState(data || []);
    const [loading, setLoading] = React.useState(!data || (Array.isArray(data) && data.length === 0));

    // Update internal state when props change
    React.useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            setHeatmapData(data);
            setLoading(false);
        }
    }, [data]);

    React.useEffect(() => {
        // If we already have data from props, don't fetch internally
        if (data && Array.isArray(data) && data.length > 0) return;

        const fetchHeatmap = async () => {
            try {
                if (!data || data.length === 0) {
                    setLoading(true);
                }
                const response = await api.get('/api/trading/market-data/heatmap');
                if (response.data) {
                    setHeatmapData(response.data);
                }
            } catch (error) {
                console.error("Error fetching heatmap:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmap();
        const interval = setInterval(fetchHeatmap, 60000); // 1 min
        return () => clearInterval(interval);
    }, [data]);

    // Take top 8 items to ensure they fit nicely in the grid
    const displayData = heatmapData.slice(0, 8);

    if (loading && displayData.length === 0) {
        return (
            <div className="glass-glow rounded-2xl shadow-xl p-4 flex flex-col h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400 mt-2">{t('market_heatmap_loading')}</span>
            </div>
        );
    }

    return (
        <div className="glass-glow rounded-2xl shadow-xl p-4 flex flex-col h-full">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center justify-between">
                <span>{t('market_heatmap_title')}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">{t('market_heatmap_real_time')}</span>
            </h3>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                {displayData.map((item, idx) => {
                    const isPositive = item.change >= 0;
                    return (
                        <div
                            key={idx}
                            className={`rounded-xl flex flex-col items-center justify-center p-2 transition-transform hover:scale-105 cursor-pointer border border-white/5 shadow-lg ${isPositive ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-900/40 hover:from-emerald-600/40' : 'bg-gradient-to-br from-pink-600/20 to-pink-900/40 hover:from-pink-600/40'}`}
                        >
                            <span className="font-bold text-white text-sm md:text-base tracking-tight drop-shadow-md">
                                {item.symbol}
                            </span>
                            <span className={`text-xs font-mono font-bold mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-pink-400'}`}>
                                {isPositive ? '+' : ''}{item.change}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketHeatmap;
