import React from 'react';
import { History } from 'lucide-react';

const TradeHistory = ({ trades, formatPrice }) => {
    return (
        <div className="glass-glow rounded-xl p-4 h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    Historique
                </h3>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                {trades.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-600 italic">
                        <p className="text-xs">Pas d'historique</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="text-[10px] uppercase text-slate-600 font-bold tracking-wider border-b border-white/5 sticky top-0 bg-[#0f0716]/80 backdrop-blur-sm z-20">
                            <tr>
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Paire</th>
                                <th className="text-left py-2">Côté</th>
                                <th className="text-right py-2">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-2">
                            {trades.slice(0, 20).map(trade => (
                                <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 text-xs">
                                    <td className="py-2 text-slate-500 font-mono">
                                        {new Date(trade.time * 1000).toLocaleString([], { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-2 text-slate-300 font-bold font-mono">{trade.ticker}</td>
                                    <td className="py-2">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-pink-500/10 text-pink-500'}`}>
                                            {trade.side}
                                        </span>
                                    </td>
                                    <td className={`py-2 text-right font-mono font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-pink-500'}`}>
                                        {trade.pnl >= 0 ? '+' : ''}{formatPrice(trade.pnl)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TradeHistory;
