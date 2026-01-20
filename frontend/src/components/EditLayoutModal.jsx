import React from 'react';
import { X, Save, BarChart3, LineChart, Briefcase, Bot, FileText, Settings } from 'lucide-react';

const EditLayoutModal = ({ isOpen, onClose, preferences, onToggle, t }) => {
    if (!isOpen) return null;

    const items = [
        { id: 'stats', label: t('layout_modal_stats'), icon: BarChart3, color: 'text-purple-400' },
        { id: 'chart', label: t('layout_modal_chart'), icon: LineChart, color: 'text-blue-400' },
        { id: 'positions', label: t('layout_modal_positions'), icon: Briefcase, color: 'text-orange-400' },
        { id: 'signals', label: t('layout_modal_signals'), icon: Bot, color: 'text-pink-400' },
        { id: 'history', label: t('layout_modal_history'), icon: FileText, color: 'text-yellow-400' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f1218] border border-white/10 rounded-2xl w-[90%] max-w-[450px] shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t('layout_modal_title')}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-black/20 ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-slate-200">{item.label}</span>
                            </div>

                            {/* Switch Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={preferences[item.id]}
                                    onChange={() => onToggle(item.id)}
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditLayoutModal;
