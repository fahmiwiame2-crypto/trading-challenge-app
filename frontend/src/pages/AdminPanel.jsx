import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { ShieldAlert, CheckCircle, XCircle, RefreshCw, CreditCard, Save, Eye, EyeOff, DollarSign, Users, Settings } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [saving, setSaving] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    // PayPal Configuration State
    const [paypalConfig, setPaypalConfig] = useState({
        client_id: '',
        client_secret: '',
        mode: 'sandbox',
        email: ''
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        try {
            // This would need admin endpoint to get all payments
            // For now, we'll show placeholder
        } catch (error) {
            console.error("Failed to fetch payments", error);
        }
    };

    const fetchPaypalConfig = async () => {
        try {
            const res = await api.get('/api/config/paypal');
            if (res.data.configs) {
                const configs = {};
                res.data.configs.forEach(c => {
                    const key = c.config_key.replace('paypal_', '');
                    configs[key] = c.config_value;
                });
                setPaypalConfig(prev => ({ ...prev, ...configs }));
            }
        } catch (error) {
            console.error("Failed to fetch PayPal config", error);
        }
    };

    const savePaypalConfig = async () => {
        setSaving(true);
        try {
            await api.post('/api/config/paypal', paypalConfig);
            alert("✅ Configuration PayPal sauvegardée avec succès!");
        } catch (error) {
            alert("❌ Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const seedDatabase = async () => {
        if (!window.confirm("⚠️ ATTENTION : Cela va supprimer tous les cours existants et les recréer.\n\nVoulez-vous continuer ?")) return;

        try {
            setLoading(true);
            const res = await api.post('/api/seed/seed-courses', {
                secret: 'seed-courses-2026',
                force: true
            });
            alert("✅ Succès ! " + (res.data.message || "Cours ajoutés avec succès."));
        } catch (error) {
            console.error("Seed error:", error);
            alert("❌ Erreur : " + (error.response?.data?.error || error.message || "Erreur inconnue"));
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (email, newStatus) => {
        try {
            await api.post('/api/admin/update-status', { email, status: newStatus });
            setUsers(users.map(u => u.email === email ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Update failed", error);
            alert("Erreur lors de la mise à jour");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchPaypalConfig();
    }, []);

    return (
        <div className="flex h-screen bg-transparent text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header - Quantum Glass */}
                        <div className="glass-glow mb-8 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                            {/* Background Blob */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                            <h1 className="text-3xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 relative z-10">
                                <ShieldAlert className="mr-3 text-cyan-500 w-8 h-8" />
                                Panneau SuperAdmin
                            </h1>
                            <div className="flex space-x-2 relative z-10">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'users' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Utilisateurs
                                </button>
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'payments' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Paiements
                                </button>
                                <button
                                    onClick={() => setActiveTab('paypal')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'paypal' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Config PayPal
                                </button>
                            </div>
                        </div>

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <>
                                <div className="flex justify-end mb-6 space-x-4 animate-in fade-in duration-500 delay-150">
                                    <button onClick={seedDatabase} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center border border-emerald-400/20">
                                        <span className="mr-2">🌱</span> Seed Data
                                    </button>
                                    <button onClick={fetchUsers} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 text-cyan-400 transition-colors">
                                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                                <div className="glass-glow rounded-2xl overflow-hidden border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/20 text-cyan-400 uppercase text-xs font-bold tracking-wider">
                                                <tr>
                                                    <th className="p-5">Utilisateur</th>
                                                    <th className="p-5">Email</th>
                                                    <th className="p-5">Balance</th>
                                                    <th className="p-5">Statut</th>
                                                    <th className="p-5 text-center">Actions Admin</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {users.map(user => (
                                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="p-5 font-bold text-white group-hover:text-cyan-300 transition-colors">{user.username}</td>
                                                        <td className="p-5 text-slate-400">{user.email}</td>
                                                        <td className="p-5 font-mono text-emerald-400">${user.balance}</td>
                                                        <td className="p-5">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.status === 'PASSED' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' :
                                                                user.status === 'FAILED' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                                                                    'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                                                }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-5 flex justify-center space-x-3">
                                                            <button
                                                                onClick={() => updateStatus(user.email, 'PASSED')}
                                                                title="Valider (Pass)"
                                                                className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-lg transition-all flex items-center font-bold text-xs"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" /> VALIDER
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(user.email, 'FAILED')}
                                                                title="Échouer (Fail)"
                                                                className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg transition-all flex items-center font-bold text-xs"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" /> ÉCHOUER
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(user.email, 'ACTIVE')}
                                                                title="Reset (Active)"
                                                                className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                            >
                                                                <RefreshCw className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {users.length === 0 && !loading && (
                                        <div className="p-12 text-center text-slate-500 italic">Aucun utilisateur trouvé. Utilisez "Seed Data" pour générer des comptes de test.</div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div className="glass-glow rounded-2xl border border-white/5 shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-xl font-bold mb-6 text-white flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                                    Historique des Paiements
                                </h2>
                                <div className="text-center text-slate-500 py-12">
                                    <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30 text-cyan-500" />
                                    <p>Les paiements seront affichés ici après les premières transactions.</p>
                                </div>
                            </div>
                        )}

                        {/* PayPal Configuration Tab */}
                        {activeTab === 'paypal' && (
                            <div className="glass-glow p-8 rounded-2xl border border-white/5 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-xl font-bold mb-6 text-white flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                                    Configuration PayPal
                                </h2>

                                <div className="space-y-6">
                                    {/* PayPal Email */}
                                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Email PayPal Business
                                        </label>
                                        <input
                                            type="email"
                                            value={paypalConfig.email}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, email: e.target.value })}
                                            placeholder="votre-email@business.com"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                    </div>

                                    {/* Client ID */}
                                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            PayPal Client ID
                                        </label>
                                        <input
                                            type="text"
                                            value={paypalConfig.client_id}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, client_id: e.target.value })}
                                            placeholder="AWp3lM...xxxxxxxx"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Trouvez ceci dans votre PayPal Developer Dashboard</p>
                                    </div>

                                    {/* Client Secret */}
                                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            PayPal Client Secret
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSecret ? "text" : "password"}
                                                value={paypalConfig.client_secret}
                                                onChange={(e) => setPaypalConfig({ ...paypalConfig, client_secret: e.target.value })}
                                                placeholder="EJ2...xxxxxxxx"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecret(!showSecret)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">⚠️ Ne partagez jamais ce secret</p>
                                    </div>

                                    {/* Environment */}
                                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Environnement
                                        </label>
                                        <select
                                            value={paypalConfig.mode}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, mode: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        >
                                            <option value="sandbox" className="bg-slate-900">🧪 Sandbox (Test Mode)</option>
                                            <option value="live" className="bg-slate-900">🚀 Production (Live)</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {paypalConfig.mode === 'sandbox'
                                                ? "Mode test - aucun paiement réel ne sera effectué"
                                                : "⚠️ Paiements réels activés!"
                                            }
                                        </p>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        onClick={savePaypalConfig}
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center disabled:opacity-50 active:scale-95"
                                    >
                                        {saving ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Sauvegarder Configuration PayPal
                                            </>
                                        )}
                                    </button>

                                    {/* Help Section */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                                        <h4 className="font-bold text-blue-400 mb-2">📘 Comment obtenir vos identifiants PayPal?</h4>
                                        <ol className="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
                                            <li>Connectez-vous à <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">developer.paypal.com</a></li>
                                            <li>Allez dans "My Apps & Credentials"</li>
                                            <li>Créez une nouvelle application ou sélectionnez une existante</li>
                                            <li>Copiez le Client ID et le Secret</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
