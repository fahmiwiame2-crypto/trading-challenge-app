import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TiltCard from '../components/ui/TiltCard';
import { useCurrency } from '../context/CurrencyContext';
import { Check, Zap, Crown, Rocket, TrendingUp, Shield, Award, CreditCard, X, Loader2, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
    const navigate = useNavigate();
    const { currency, formatPrice } = useCurrency();
    const { user, refreshUser } = useAuth();
    const { t, language } = useLanguage();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [modalStep, setModalStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        userAddress: '',
        userCity: '',
        userCountry: '',
        v_sys_01: '', // cardNumber replacement
        v_sys_02: '', // expiry replacement
        v_sys_03: '', // cvc replacement
        v_sys_04: '', // wallet replacement
        v_sys_05: '', // paypal replacement
    });

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: 20, // USD Base (approx 200 MAD)
            capital: 5000,
            icon: Zap,
            color: 'from-cyan-600 to-blue-600',
            borderColor: 'border-white/5 hover:border-cyan-500/50',
            features: [
                `${t('pricing_capital')}: ${formatPrice(5000)}`,
                `${t('pricing_profit_split')}: 80%`,
                `${t('pricing_leverage')} 1:100`,
                t('pricing_support_standard'),
                t('pricing_ia_basic'),
                t('pricing_community_access'),
            ],
            recommended: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 50, // USD Base (approx 500 MAD)
            capital: 25000,
            icon: Crown,
            color: 'from-cyan-500 to-emerald-500',
            borderColor: 'border-white/5 hover:border-cyan-500/50',
            features: [
                `${t('pricing_capital')}: ${formatPrice(25000)}`,
                `${t('pricing_profit_split')}: 85%`,
                `${t('pricing_leverage')} 1:100`,
                t('pricing_support_priority'),
                t('pricing_ia_basic'),
                t('pricing_community_access'),
                t('pricing_webinars'),
                t('pricing_analysis_perf'),
            ],
            recommended: true,
        },
        {
            id: 'elite',
            name: 'Elite',
            price: 100, // USD Base (approx 1000 MAD)
            capital: 100000,
            icon: Rocket,
            color: 'from-amber-500 to-orange-500',
            borderColor: 'border-white/5 hover:border-amber-500/50',
            features: [
                `${t('pricing_capital')}: ${formatPrice(100000)}`,
                `${t('pricing_profit_split')}: 90%`,
                `${t('pricing_leverage')} 1:200`,
                t('pricing_support_vip'),
                t('pricing_ia_advanced'),
                t('pricing_community_vip'),
                t('pricing_coaching'),
                t('pricing_analysis_adv'),
                t('pricing_strategies_exclusive'),
            ],
            recommended: false,
        },
    ];

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async () => {
        // Validation basique
        if (!formData.userName || !formData.userEmail || !formData.userPhone) {
            alert(t('pricing_alert_contact'));
            setModalStep(1);
            return;
        }

        if (paymentMethod === 'card' && (!formData.v_sys_01 || !formData.v_sys_02 || !formData.v_sys_03)) {
            alert(t('pricing_alert_validation'));
            return;
        }

        if (paymentMethod === 'crypto' && !formData.v_sys_04) {
            alert(t('pricing_alert_transfer'));
            return;
        }

        if (paymentMethod === 'paypal' && !formData.v_sys_05) {
            alert(t('pricing_alert_paypal'));
            return;
        }

        setProcessing(true);

        try {
            // Processing directly with API
            const response = await api.post('/api/purchase', {
                plan_name: selectedPlan.name, // Send name (e.g. 'Starter') not ID
                payment_method: paymentMethod,
                price: selectedPlan.price,
                email: formData.userEmail || user?.email,
                customerInfo: formData
            });

            if (response.data.success) {
                // Refresh user profile to update status and unlock dashboard
                await refreshUser();
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.response?.data?.message || "Erreur lors du traitement. Veuillez réessayer.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-screen bg-transparent text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header - Quantum Glass Style */}
                        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                                <DollarSign className="w-4 h-4 text-cyan-400 mr-2" />
                                <span className="text-sm text-cyan-300 font-medium">{t('pricing_title')}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                {t('pricing_title')}
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                {t('pricing_subtitle')}
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {plans.map((plan) => {
                                const Icon = plan.icon;
                                return (
                                    <TiltCard
                                        key={plan.id}
                                        className="relative !overflow-visible"
                                        tiltAmount={8}
                                        scale={1.03}
                                    >
                                        {plan.recommended && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] flex justify-center w-full pointer-events-none">
                                                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-[0_4px_20px_rgba(34,211,238,0.6)] border border-white/20 tracking-widest uppercase">
                                                    {t('pricing_recommended')}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`glass-glow rounded-3xl p-8 pt-12 h-full flex flex-col ${plan.borderColor} ${plan.recommended ? 'ring-2 ring-cyan-500/50' : ''}`}>
                                            <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                                            <div className="mb-6">
                                                <div className="flex items-baseline">
                                                    <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                                        {formatPrice(plan.price).replace(currency.symbol, '')}
                                                    </span>
                                                    <span className="text-slate-400 ml-2">{currency.code}</span>
                                                </div>
                                                <p className="text-cyan-400 font-bold text-lg mt-2">{t('pricing_capital')}: {formatPrice(plan.capital)}</p>
                                            </div>

                                            <ul className="space-y-3 mb-8 flex-1">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <Check className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                                                        <span className="text-slate-300 text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handleSelectPlan(plan)}
                                                className={`w-full py-4 rounded-xl font-bold text-white transition-all bg-gradient-to-r ${plan.color} hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-[0.98]`}
                                            >
                                                {t('pricing_start')}
                                            </button>
                                        </div>
                                    </TiltCard>
                                );
                            })}
                        </div>

                        {/* Features Comparison - Quantum Glass Style */}
                        <div className="glass-glow rounded-3xl p-8 mb-12 relative overflow-hidden group">
                            {/* Background Blob */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-600/10 transition-colors duration-1000"></div>

                            <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 relative z-10">
                                {t('pricing_all_plans_include')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{t('pricing_feature_unlimited')}</h3>
                                        <p className="text-slate-400 text-sm">{t('pricing_feature_unlimited_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Shield className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{t('pricing_feature_rules')}</h3>
                                        <p className="text-slate-400 text-sm">{t('pricing_feature_rules_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{t('pricing_feature_payments')}</h3>
                                        <p className="text-slate-400 text-sm">{t('pricing_feature_payments_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal - Quantum Glass Style */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-glow bg-[#0a0f1a] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">{t('pricing_secure_payment')}</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{t('pricing_step')} {modalStep} {t('pricing_of')} 2</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {success ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                                        <Check className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-white">{t('pricing_validation_success')}</h3>
                                        <p className="text-slate-400">{t('pricing_activation_pending')}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-500 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{t('pricing_redirect_dashboard')}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {modalStep === 1 ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('pricing_client_info')}</h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <input
                                                        type="text"
                                                        name="userName"
                                                        value={formData.userName}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                                        placeholder={t('pricing_placeholder_name')}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="userEmail"
                                                        value={formData.userEmail}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                                        placeholder={t('pricing_placeholder_email')}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="userPhone"
                                                        value={formData.userPhone}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                                        placeholder={t('pricing_placeholder_phone')}
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input
                                                            type="text"
                                                            name="userCity"
                                                            value={formData.userCity}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                                            placeholder={t('pricing_placeholder_city')}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="userCountry"
                                                            value={formData.userCountry}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none transition-all"
                                                            placeholder={t('pricing_placeholder_country')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (formData.userName && formData.userEmail && formData.userPhone) {
                                                        setModalStep(2);
                                                    } else {
                                                        alert(t('pricing_fill_mandatory'));
                                                    }
                                                }}
                                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center group active:scale-[0.98]"
                                            >
                                                {t('pricing_next_step')}
                                                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('pricing_payment_method')}</h3>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { id: 'card', label: t('pricing_method_card'), icon: '💳' },
                                                        { id: 'paypal', label: t('pricing_method_paypal'), icon: '🅿️' },
                                                        { id: 'crypto', label: t('pricing_method_crypto'), icon: '₿' }
                                                    ].map(method => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setPaymentMethod(method.id)}
                                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${paymentMethod === method.id
                                                                ? 'border-cyan-500 bg-cyan-500/10'
                                                                : 'border-white/5 hover:border-white/10'
                                                                }`}
                                                        >
                                                            <span className="text-xl">{method.icon}</span>
                                                            <span className="text-[10px] font-bold text-slate-400">{method.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {paymentMethod === 'card' && (
                                                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col space-y-4 shadow-inner">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex space-x-1">
                                                            {t('pricing_banking_info')}
                                                        </span>
                                                        <div className="flex space-x-1">
                                                            <div className="w-6 h-4 bg-slate-800 rounded-sm"></div>
                                                            <div className="w-6 h-4 bg-slate-700 rounded-sm"></div>
                                                            <div className="w-6 h-4 bg-slate-600 rounded-sm"></div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5 ml-1 flex space-x-0.5">
                                                                {t('pricing_card_number')}
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="v_sys_01"
                                                                    autoComplete="one-time-code"
                                                                    spellCheck="false"
                                                                    value={formData.v_sys_01}
                                                                    onChange={handleInputChange}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-sm tracking-[0.2em]"
                                                                    placeholder="•••• •••• •••• ••••"
                                                                />
                                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5 ml-1 flex space-x-0.5">
                                                                    {t('pricing_expiry')}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="v_sys_02"
                                                                    autoComplete="one-time-code"
                                                                    spellCheck="false"
                                                                    value={formData.v_sys_02}
                                                                    onChange={handleInputChange}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-sm"
                                                                    placeholder="MM / YY"
                                                                    maxLength="5"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5 ml-1 flex space-x-0.5">
                                                                    {t('pricing_cvv')}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="v_sys_03"
                                                                    autoComplete="one-time-code"
                                                                    spellCheck="false"
                                                                    value={formData.v_sys_03}
                                                                    onChange={handleInputChange}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-sm"
                                                                    placeholder="•••"
                                                                    maxLength="4"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'crypto' && (
                                                <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                                                    <div className="text-[9px] text-cyan-400 uppercase font-bold mb-2 ml-1 flex space-x-1">
                                                        {t('pricing_wallet_address')}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="v_sys_04"
                                                        autoComplete="off"
                                                        value={formData.v_sys_04}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-xs"
                                                        placeholder="0x..."
                                                    />
                                                </div>
                                            )}

                                            {paymentMethod === 'paypal' && (
                                                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col space-y-4 shadow-inner">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex space-x-1">
                                                            {t('pricing_paypal_info')}
                                                        </span>
                                                        <div className="text-xl">🅿️</div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5 ml-1 flex space-x-0.5">
                                                                {t('pricing_paypal_account')}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="v_sys_05"
                                                                value={formData.v_sys_05}
                                                                onChange={handleInputChange}
                                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500/50 focus:outline-none text-sm"
                                                                placeholder={t('pricing_placeholder_paypal')}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-blue-400/70 text-center italic">
                                                            {t('pricing_paypal_redirect')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setModalStep(1)}
                                                    disabled={processing}
                                                    className="px-6 py-4 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all disabled:opacity-50"
                                                >
                                                    {t('pricing_btn_back')}
                                                </button>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={!paymentMethod || processing}
                                                    className={`flex-1 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center ${paymentMethod && !processing
                                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-2xl hover:shadow-cyan-500/30'
                                                        : 'bg-slate-800 text-slate-600'
                                                        }`}
                                                >
                                                    {processing ? (
                                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    ) : null}
                                                    {processing ? t('pricing_processing') : `${t('pricing_pay_activate')} (${selectedPlan ? formatPrice(selectedPlan.price) : ''})`}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pricing;
