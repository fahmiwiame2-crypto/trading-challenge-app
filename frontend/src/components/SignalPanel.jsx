import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Target, Shield, ArrowRight } from 'lucide-react';
import api, { getAiSignal } from '../api/api';

const SignalPanel = ({ ticker }) => {
    const [activeTab, setActiveTab] = useState('ai');
    const [signalData, setSignalData] = useState(null);
    const [expertSignals, setExpertSignals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const fetchSignal = async () => {
            setLoading(true);
            try {
                // Call real AI endpoint
                const aiResponse = await getAiSignal(ticker);
                setSignalData(aiResponse.data);

                // GET /api/trading/expert-signals
                const expertResponse = await api.get('/api/trading/expert-signals');
                setExpertSignals(expertResponse.data);

                setTimeLeft(30); // Reset timer on fetch
            } catch (error) {
                console.error("Error fetching signals:", error);
            } finally {
                setLoading(false);
            }
        };

        if (ticker) {
            fetchSignal();
            const interval = setInterval(fetchSignal, 30000); // 30s refresh

            // Countdown timer
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => {
                clearInterval(interval);
                clearInterval(timer);
            };
        }
    }, [ticker]);

    if (!ticker) return null;

    return (
        <div className="glass-glow rounded-2xl shadow-xl p-5 flex flex-col h-full relative">
            {/* Progress Bar for Next Update */}
            {/* Scanning Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none transition-opacity duration-500 ${timeLeft < 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>

            <div className="flex items-center justify-between mb-4 mt-1">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <span className="relative flex h-2.5 w-2.5 mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 duration-700"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                    </span>
                    Analyse Live
                    {timeLeft < 5 && <span className="ml-2 text-[10px] text-cyan-400 animate-pulse font-mono tracking-wider">SCAN...</span>}
                </h3>
                <span className="text-[10px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-1 rounded-md font-mono tracking-wider flex items-center gap-2">
                    {ticker}
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                </span>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-0.5 bg-[#0a0f1a]/60 rounded-xl mb-5 border border-cyan-500/10 shadow-inner">
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'ai' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    Signaux IA
                </button>
                <button
                    onClick={() => setActiveTab('experts')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'experts' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    Experts
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {loading && !signalData ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        <span className="text-xs text-cyan-400/50 animate-pulse">Analyse en cours...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'ai' ? (
                            <>
                                {/* Main Signal Card */}
                                <div className={`p-4 rounded-xl border transition-all duration-500 relative overflow-hidden group ${signalData?.signal === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30' : signalData?.signal === 'SELL' ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                                    {/* Ambient Glow */}
                                    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20 ${signalData?.signal === 'BUY' ? 'bg-emerald-500' : signalData?.signal === 'SELL' ? 'bg-red-500' : 'bg-slate-500'}`}></div>

                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${signalData?.signal === 'BUY' ? 'text-emerald-400' : signalData?.signal === 'SELL' ? 'text-red-400' : 'text-slate-400'}`}>Signal</span>
                                            <span className="font-extrabold text-white text-2xl tracking-tight">{signalData?.signal === 'BUY' ? 'ACHAT' : signalData?.signal === 'SELL' ? 'VENTE' : 'NEUTRE'}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Confiance</span>
                                            <div className="flex items-center bg-[#0a0f1a]/40 rounded-lg px-2 py-1 border border-white/5">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${signalData?.confidence > 80 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-500'}`}></div>
                                                <span className={`text-sm font-bold ${signalData?.confidence > 80 ? 'text-white' : 'text-slate-300'}`}>
                                                    {signalData?.confidence}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
                                        <div className="bg-[#0a0f1a]/40 rounded-lg p-2 border border-white/5">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Entrée</p>
                                            <p className="text-white font-bold text-xs">{signalData?.entry_price}</p>
                                        </div>
                                        <div className="bg-[#0a0f1a]/40 rounded-lg p-2 border border-white/5">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Objectif (TP)</p>
                                            <p className="text-emerald-400 font-bold text-xs">{signalData?.take_profit}</p>
                                        </div>
                                        <div className="bg-[#0a0f1a]/40 rounded-lg p-2 border border-white/5">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Stop Loss</p>
                                            <p className="text-red-400 font-bold text-xs">{signalData?.stop_loss}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-300 text-xs leading-relaxed mb-4 font-medium relative z-10 border-t border-white/5 pt-3">
                                        "{signalData?.reason}"
                                    </p>

                                    <div className={`flex items-center text-xs font-bold px-3 py-2 rounded-lg bg-[#0a0f1a]/20 border border-white/5 relative z-10 ${signalData?.signal === 'BUY' ? 'text-emerald-400' : signalData?.signal === 'SELL' ? 'text-red-400' : 'text-slate-400'}`}>
                                        {signalData?.signal === 'BUY' ? <TrendingUp className="w-3.5 h-3.5 mr-2" /> : signalData?.signal === 'SELL' ? <TrendingDown className="w-3.5 h-3.5 mr-2" /> : <AlertCircle className="w-3.5 h-3.5 mr-2" />}
                                        {signalData?.signal === 'BUY' ? 'Potentiel Haussier Confirmé' : signalData?.signal === 'SELL' ? 'Risque de Baisse Confirmé' : 'Marché Indécis'}
                                    </div>
                                </div>

                                {/* Risk Warning - Fixed visibility and layout */}
                                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl border border-amber-500/20 flex gap-3 shadow-lg shadow-amber-900/5">
                                    <div className="bg-amber-500/20 p-1.5 rounded-lg h-fit">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-bold text-amber-200 mb-0.5">Détection de Risque</h4>
                                        <p className="text-[11px] text-amber-200/70 leading-snug">
                                            Volatilité modérée détectée. Ajustez vos stop-loss.
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                {expertSignals.map((exp, idx) => (
                                    <div key={idx} className="bg-slate-800/30 border border-cyan-500/10 rounded-xl p-3 hover:bg-cyan-500/5 transition-all cursor-pointer group hover:border-cyan-500/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-[1px]">
                                                    <div className="w-full h-full rounded-full bg-[#0a0f1a] flex items-center justify-center text-[10px] font-bold text-white">
                                                        {exp.expert.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors block leading-none mb-0.5">{exp.expert}</span>
                                                    <span className="text-[9px] text-slate-500">{exp.time}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${exp.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : exp.action === 'SELL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                {exp.action}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 italic pl-9 border-l-2 border-cyan-500/20 ml-3.5">"{exp.reason}"</p>
                                    </div>
                                ))}
                                <button className="w-full py-2 border border-dashed border-cyan-500/30 rounded-lg text-[10px] text-cyan-400 hover:text-white hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all">
                                    Voir plus d'analyses
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignalPanel;
