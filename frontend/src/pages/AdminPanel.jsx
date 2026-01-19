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
        try {
            await api.post('/api/seed');
            fetchUsers();
            alert("Base de données initialisée avec succès !");
        } catch (error) {
            alert("Erreur lors du seeding");
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
        <div className="flex h-screen bg-[#0f0716] text-white overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 bg-[#1a0b2e]/60 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-md shadow-2xl">
                            <h1 className="text-3xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                <ShieldAlert className="mr-3 text-pink-500" />
                                Panneau SuperAdmin
                            </h1>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-purple-500/10'}`}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Utilisateurs
                                </button>
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'payments' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-purple-500/10'}`}
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Paiements
                                </button>
                                <button
                                    onClick={() => setActiveTab('paypal')}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center ${activeTab === 'paypal' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-purple-500/10'}`}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Config PayPal
                                </button>
                            </div>
                        </div>

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <>
                                <div className="flex justify-end mb-4 space-x-4">
                                    <button onClick={seedDatabase} className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 active:scale-95 flex items-center">
                                        <span className="mr-2">🌱</span> Seed Data
                                    </button>
                                    <button onClick={fetchUsers} className="p-2 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 border border-purple-500/20 text-purple-300">
                                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                                <div className="bg-[#1a0b2e]/40 rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl backdrop-blur-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#1a0b2e] text-purple-300/60 uppercase text-xs font-bold tracking-wider">
                                            <tr>
                                                <th className="p-5">Utilisateur</th>
                                                <th className="p-5">Email</th>
                                                <th className="p-5">Balance</th>
                                                <th className="p-5">Statut</th>
                                                <th className="p-5 text-center">Actions Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-purple-500/10">
                                            {users.map(user => (
                                                <tr key={user.id} className="hover:bg-purple-500/5 transition-colors group">
                                                    <td className="p-5 font-bold text-white group-hover:text-pink-300 transition-colors">{user.username}</td>
                                                    <td className="p-5 text-slate-400">{user.email}</td>
                                                    <td className="p-5 font-mono text-pink-400">${user.balance}</td>
                                                    <td className="p-5">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.status === 'PASSED' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                                                            user.status === 'FAILED' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                                                                'bg-purple-500/10 border-purple-500/50 text-purple-400'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 flex justify-center space-x-3">
                                                        <button
                                                            onClick={() => updateStatus(user.email, 'PASSED')}
                                                            title="Valider (Pass)"
                                                            className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white rounded-lg transition-all flex items-center font-bold text-xs"
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
                                                            className="p-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-white rounded-lg transition-all"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length === 0 && !loading && (
                                        <div className="p-12 text-center text-purple-300/40 italic">Aucun utilisateur trouvé. Utilisez "Seed Data" pour générer des comptes de test.</div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div className="bg-[#1a0b2e]/40 rounded-2xl border border-purple-500/20 shadow-2xl backdrop-blur-sm p-6">
                                <h2 className="text-xl font-bold mb-6 text-purple-200 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2 text-pink-400" />
                                    Historique des Paiements
                                </h2>
                                <div className="text-center text-purple-300/60 py-12">
                                    <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p>Les paiements seront affichés ici après les premières transactions.</p>
                                </div>
                            </div>
                        )}

                        {/* PayPal Configuration Tab */}
                        {activeTab === 'paypal' && (
                            <div className="bg-[#1a0b2e]/40 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold mb-6 text-purple-200 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-pink-400" />
                                    Configuration PayPal
                                </h2>

                                <div className="space-y-6">
                                    {/* PayPal Email */}
                                    <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Email PayPal Business
                                        </label>
                                        <input
                                            type="email"
                                            value={paypalConfig.email}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, email: e.target.value })}
                                            placeholder="votre-email@business.com"
                                            className="w-full bg-[#0f0716] border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    </div>

                                    {/* Client ID */}
                                    <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            PayPal Client ID
                                        </label>
                                        <input
                                            type="text"
                                            value={paypalConfig.client_id}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, client_id: e.target.value })}
                                            placeholder="AWp3lM...xxxxxxxx"
                                            className="w-full bg-[#0f0716] border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Trouvez ceci dans votre PayPal Developer Dashboard</p>
                                    </div>

                                    {/* Client Secret */}
                                    <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            PayPal Client Secret
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showSecret ? "text" : "password"}
                                                value={paypalConfig.client_secret}
                                                onChange={(e) => setPaypalConfig({ ...paypalConfig, client_secret: e.target.value })}
                                                placeholder="EJ2...xxxxxxxx"
                                                className="w-full bg-[#0f0716] border border-purple-500/30 rounded-lg p-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
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
                                    <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Environnement
                                        </label>
                                        <select
                                            value={paypalConfig.mode}
                                            onChange={(e) => setPaypalConfig({ ...paypalConfig, mode: e.target.value })}
                                            className="w-full bg-[#0f0716] border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="sandbox">🧪 Sandbox (Test Mode)</option>
                                            <option value="live">🚀 Production (Live)</option>
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
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center disabled:opacity-50"
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
