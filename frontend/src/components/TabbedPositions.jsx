import React, { useState } from 'react';
import { Activity, History, Layers } from 'lucide-react';

const TabbedPositions = ({ positions, history, formatPrice, onClosePosition }) => {
    const [activeTab, setActiveTab] = useState('positions'); // 'positions' | 'history'

    return (
        <div className="glass-glow rounded-xl p-4 h-full flex flex-col relative group overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 group-hover:bg-cyan-600/10 transition-colors"></div>

            {/* Header / Tabs */}
            <div className="flex items-center space-x-6 border-b border-white/10 mb-4 px-2 relative z-10">
                <button
                    onClick={() => setActiveTab('positions')}
                    className={`flex items-center pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'positions'
                        ? 'text-cyan-400 border-cyan-400'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                >
                    <Layers className="w-4 h-4 mr-2" />
                    Positions Ouvertes
                    {positions.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px]">
                            {positions.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'history'
                        ? 'text-cyan-400 border-cyan-400'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                >
                    <History className="w-4 h-4 mr-2" />
                    Historique
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto custom-scrollbar relative z-10">

                {/* POSITIONS TAB */}
                {activeTab === 'positions' && (
                    <>
                        {positions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/5 rounded-lg bg-white/[0.02] p-4">
                                <p className="text-2xl mb-2 opacity-50">💤</p>
                                <p className="text-sm font-medium text-slate-400 text-center">Aucune position ouverte</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="text-[10px] uppercase text-slate-500 font-bold tracking-wider border-b border-white/5 sticky top-0 bg-[#0a0f1a]/80 backdrop-blur-sm z-20">
                                    <tr>
                                        <th className="text-left py-2 pl-2">Paire</th>
                                        <th className="text-left py-2">Type</th>
                                        <th className="text-right py-2">P-Actuel</th>
                                        <th className="text-right py-2">P&L</th>
                                        <th className="text-right py-2 pr-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-1">
                                    {positions.map(pos => (
                                        <tr key={pos.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 text-xs">
                                            <td className="py-3 pl-2 font-bold text-white font-mono">
                                                <div className="flex items-center">
                                                    <div className={`w-1 h-6 mr-3 rounded-full ${pos.side === 'BUY' ? 'bg-emerald-500' : 'bg-pink-500'}`}></div>
                                                    {pos.ticker}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pos.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    {pos.side}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right font-mono text-slate-400">
                                                {formatPrice(pos.current_price)}
                                            </td>
                                            <td className={`py-3 text-right font-mono font-bold ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {pos.pnl >= 0 ? '+' : ''}{formatPrice(pos.pnl)}
                                            </td>
                                            <td className="py-3 text-right pr-2">
                                                <button
                                                    onClick={() => onClosePosition(pos.id)}
                                                    className="text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/50 px-3 py-1.5 rounded transition-all shadow-sm"
                                                >
                                                    Fermer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Summary Footer for Positions */}
                        {positions.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center px-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Total P&L</span>
                                <span className={`text-sm font-mono font-bold ${positions.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                    {positions.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? '+' : ''}{formatPrice(positions.reduce((acc, p) => acc + p.pnl, 0))}
                                </span>
                            </div>
                        )}
                    </>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <table className="w-full">
                        <thead className="text-[10px] uppercase text-slate-600 font-bold tracking-wider border-b border-white/5 sticky top-0 bg-[#0a0f1a]/80 backdrop-blur-sm z-20">
                            <tr>
                                <th className="text-left py-2 pl-2">Date</th>
                                <th className="text-left py-2">Paire</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-right py-2 pr-2">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-1">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-slate-500 text-xs italic">
                                        Aucun trade récent
                                    </td>
                                </tr>
                            ) : (
                                history.slice(0, 30).map(trade => (
                                    <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 text-xs">
                                        <td className="py-3 pl-2 text-slate-500 font-mono">
                                            {new Date(trade.time * 1000).toLocaleString('fr-FR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-3 text-slate-300 font-bold font-mono">{trade.ticker}</td>
                                        <td className="py-3">
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {trade.side}
                                            </span>
                                        </td>
                                        <td className={`py-3 text-right pr-2 font-mono font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {trade.pnl >= 0 ? '+' : ''}{formatPrice(trade.pnl)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TabbedPositions;
