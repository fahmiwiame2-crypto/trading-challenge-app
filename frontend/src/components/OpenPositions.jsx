import React from 'react';
import { Activity } from 'lucide-react';

const OpenPositions = ({ positions, formatPrice, onClosePosition }) => {
    return (
        <div className="glass-glow rounded-xl p-4 h-full flex flex-col relative group overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 group-hover:bg-purple-600/10 transition-colors"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center tracking-tight uppercase">
                    <Activity className="w-4 h-4 text-purple-400 mr-2" />
                    Positions
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">P&L</span>
                    <span className={`text-sm font-mono font-bold ${positions.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? 'text-emerald-400' : 'text-pink-500'}`}>
                        {positions.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? '+' : ''}{formatPrice(positions.reduce((acc, p) => acc + p.pnl, 0))}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar relative z-10">
                {positions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/5 rounded-lg bg-white/[0.02] p-4">
                        <p className="text-2xl mb-2 opacity-50">💤</p>
                        <p className="text-sm font-medium text-slate-400 text-center">Aucune position</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="text-[10px] uppercase text-slate-500 font-bold tracking-wider border-b border-white/5 sticky top-0 bg-[#0f0716]/80 backdrop-blur-sm z-20">
                            <tr>
                                <th className="text-left py-2">Paire</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-right py-2">P&L</th>
                                <th className="text-right py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-2">
                            {positions.map(pos => (
                                <tr key={pos.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 text-xs">
                                    <td className="py-3 font-bold text-white font-mono">
                                        <div className="flex items-center">
                                            <div className={`w-1 h-6 mr-2 rounded-full ${pos.side === 'BUY' ? 'bg-emerald-500' : 'bg-pink-500'}`}></div>
                                            {pos.ticker}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pos.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}`}>
                                            {pos.side}
                                        </span>
                                    </td>
                                    <td className={`py-3 text-right font-mono font-bold ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                                        {pos.pnl >= 0 ? '+' : ''}{formatPrice(pos.pnl)}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => onClosePosition(pos.id)}
                                            className="text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/50 px-2 py-1 rounded transition-all"
                                        >
                                            Fermer
                                        </button>
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

export default OpenPositions;
