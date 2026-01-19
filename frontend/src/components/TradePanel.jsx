import React, { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from '../components/ui/sonner';
import ParticleButton from './ui/ParticleButton';

const TradePanel = ({ ticker = 'BTC-USD', onTradeComplete, onNewPosition }) => {
    const { user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const { isEnabled } = useNotifications();
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);

    const executeTrade = async (action) => {
        setLoading(true);
        try {
            // POST /api/trading/trade
            // Convert amount from selected currency to USD for backend
            const amountInUSD = parseFloat(amount) / currency.rate;

            const response = await api.post('/api/trading/trade', {
                ticker,
                side: action.toUpperCase(),
                amount: amountInUSD,
                email: user?.username || user?.email || 'demo@tradesense.ai'
            });

            if (isEnabled('trades')) {
                toast.success(`Ordre ${action} exécuté avec succès!`, {
                    description: `${action === 'BUY' ? 'Achat' : 'Vente'} de ${ticker} pour ${formatPrice(parseFloat(amount))}`
                });
            }

            // Call onNewPosition with trade data if provided
            if (onNewPosition && response.data?.trade) {
                onNewPosition({
                    ...response.data.trade,
                    ticker,
                    side: action.toUpperCase(),
                    amount: amountInUSD,
                    current_price: response.data.trade.entry_price
                });
            }

            if (onTradeComplete && response.data) {
                // Construct trade object if backend doesn't return full object in expected format
                const tradeData = response.data.trade || {
                    ticker,
                    side: action.toUpperCase(),
                    amount: amountInUSD,
                    entry_price: response.data.price || 0, // Fallback
                    pnl: 0
                };
                onTradeComplete(tradeData);
            }
        } catch (error) {
            console.error("Trade error details:", error);
            console.error("URL:", error.config?.url);
            console.error("Headers:", error.config?.headers);

            // Construct a detailed error message
            let errorMessage = "Erreur inconnue";
            if (error.response) {
                // Server responded with a status code outside 2xx
                errorMessage = error.response.data?.message || `Erreur Serveur (${error.response.status})`;
            } else if (error.request) {
                // Request made but no response received
                errorMessage = "Pas de réponse du serveur (Problème Réseau/Proxy)";
            } else {
                // Setup error
                errorMessage = error.message;
            }

            toast.error("Échec de l'ordre", {
                description: `${errorMessage} (User: ${user?.username || 'N/A'})`
            });

            if (errorMessage.includes("FAILED")) {
                toast.error("Compte Bloqué", {
                    description: "Votre compte est en échec. Veuillez réinitialiser."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-glow rounded-2xl shadow-xl p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                <span>Exécution (Live)</span>
                <span className="text-sm font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded">{ticker}</span>
            </h3>

            <div className="mb-8">
                <label className="block text-cyan-300/80 text-xs font-bold uppercase tracking-wider mb-2">Montant ({currency.code})</label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500 font-bold">{currency.symbol}</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#0a0f1a]/80 border border-cyan-500/20 text-white font-mono text-lg rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none transition-all group-hover:border-cyan-500/40"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <ParticleButton
                    onClick={() => executeTrade('BUY')}
                    disabled={loading}
                    particleColor="#22c55e"
                    particleCount={16}
                    className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center group"
                >
                    <span className="text-xs opacity-80 mb-1 group-hover:opacity-100">LONG</span>
                    <span className="text-lg tracking-wide">ACHETER</span>
                </ParticleButton>
                <ParticleButton
                    onClick={() => executeTrade('SELL')}
                    disabled={loading}
                    particleColor="#ef4444"
                    particleCount={16}
                    className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 flex flex-col items-center justify-center group"
                >
                    <span className="text-xs opacity-80 mb-1 group-hover:opacity-100">SHORT</span>
                    <span className="text-lg tracking-wide">VENDRE</span>
                </ParticleButton>
            </div>
        </div>
    );
};

export default TradePanel;
