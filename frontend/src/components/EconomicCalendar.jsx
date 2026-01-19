import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const EconomicCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [urgentAlert, setUrgentAlert] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("Fetching calendar...");
                const response = await api.get('/api/news/calendar');
                console.log("Calendar Response:", response.data);
                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                    checkUrgentEvents(response.data);
                } else {
                    console.error("Calendar data is not an array:", response.data);
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error fetching calendar:", error);
                setEvents([]); // Ensure it's empty on error
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
        // Refresh every minute
        const interval = setInterval(fetchEvents, 60000);
        return () => clearInterval(interval);
    }, []);

    const checkUrgentEvents = (currentEvents) => {
        const now = new Date();
        const urgent = currentEvents.find(e => {
            if (e.status !== 'UPCOMING' || e.impact !== 'HIGH') return false;

            const eventTime = new Date(e.timestamp);
            const diffMinutes = (eventTime - now) / 1000 / 60;

            return diffMinutes > 0 && diffMinutes <= 15;
        });

        if (urgent && !urgentAlert) {
            setUrgentAlert(urgent);
            toast.error(`NEWS ALERT: ${urgent.title}`, {
                description: `High Impact News in ${Math.ceil((new Date(urgent.timestamp) - now) / 1000 / 60)} minutes! Avoid Trading.`,
                duration: 10000,
            });
        }
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'HIGH': return 'bg-red-500 text-white';
            case 'MEDIUM': return 'bg-orange-500 text-white';
            default: return 'bg-yellow-500/50 text-yellow-100';
        }
    };

    if (loading) return <div className="text-center p-4 text-purple-300">Loading Calendar...</div>;

    return (
        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-5 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                    Calendrier Éco
                </h3>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                    UTC {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {urgentAlert && (
                <div className="mb-4 bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-xl flex items-center animate-pulse">
                    <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                    <div>
                        <p className="font-bold text-sm">ALERTE NEWS IMPOSANTE</p>
                        <p className="text-xs">{urgentAlert.title} (High Impact)</p>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-700/30">
                <div className="space-y-3">
                    {events.length === 0 && !loading && (
                        <div className="text-center py-6">
                            <p className="text-slate-500 text-sm">Aucun événement disponible.</p>
                            <button onClick={() => window.location.reload()} className="text-xs text-purple-400 mt-2 underline">Réessayer</button>
                        </div>
                    )}
                    {events.map((evt) => (
                        <div key={evt.id} className={`p-3 rounded-xl border transition-all ${evt.status === 'COMPLETED' ? 'bg-purple-900/10 border-purple-500/5 grayscale opacity-60' : 'bg-[#0f0716]/60 border-purple-500/10 hover:border-purple-500/30'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-sm text-slate-300 flex items-center">
                                    <Clock className="w-3 h-3 mr-1 opacity-50" />
                                    {evt.time}
                                </span>
                                <div className="flex space-x-2">
                                    <span className="text-xs font-bold text-slate-400">{evt.currency}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getImpactColor(evt.impact)}`}>
                                        {evt.impact}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-white mb-2 leading-tight">{evt.title}</p>
                            <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                                <div className="text-center">
                                    <span className="block text-slate-500 scale-90 mb-0.5">Actuel</span>
                                    <span className="font-mono text-purple-300">{evt.actual}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-slate-500 scale-90 mb-0.5">Prévu</span>
                                    <span className="font-mono text-slate-300">{evt.forecast}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-500/10 text-center">
                <button className="text-xs text-purple-400 hover:text-white transition-colors flex items-center justify-center w-full">
                    Voir Calendrier Complet →
                </button>
            </div>
        </div>
    );
};

export default EconomicCalendar;
