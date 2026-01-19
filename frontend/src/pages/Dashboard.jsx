import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../hooks/use-toast';
import Sidebar from '../components/Sidebar';
import TradingChart from '../components/TradingChart';
import TradePanel from '../components/TradePanel';
import SignalPanel from '../components/SignalPanel';
import ChallengeStats from '../components/ChallengeStats';

import CommandPalette from '../components/CommandPalette';
import AIChatbot from '../components/AIChatbot';
import MarketHeatmap from '../components/MarketHeatmap';
import TabbedPositions from '../components/TabbedPositions';
import EditLayoutModal from '../components/EditLayoutModal';
import { Menu, Search, ChevronDown, Maximize2, Minimize2, GripVertical, Layout } from 'lucide-react';

const defaultLayouts = {
    lg: [
        { i: 'chart', x: 0, y: 0, w: 8, h: 14 },
        { i: 'heatmap', x: 8, y: 0, w: 4, h: 6 },
        { i: 'tradePanel', x: 8, y: 6, w: 4, h: 8 },
        { i: 'signals', x: 0, y: 14, w: 8, h: 8 },
        { i: 'positions', x: 8, y: 14, w: 4, h: 8 },
        { i: 'history', x: 0, y: 22, w: 6, h: 8 },
        { i: 'calendar', x: 6, y: 22, w: 6, h: 8 }
    ],
    md: [
        { i: 'chart', x: 0, y: 0, w: 10, h: 12 },
        { i: 'heatmap', x: 0, y: 12, w: 5, h: 6 },
        { i: 'tradePanel', x: 5, y: 12, w: 5, h: 6 },
        { i: 'signals', x: 0, y: 18, w: 10, h: 6 },
        { i: 'positions', x: 0, y: 24, w: 10, h: 6 },
        { i: 'history', x: 0, y: 30, w: 10, h: 6 },
        { i: 'calendar', x: 0, y: 36, w: 10, h: 6 }
    ]
};

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ticker, setTicker] = useState('BTC-USD');
    const { user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const { toast } = useToast();
    const [stats, setStats] = useState(null);
    const [openPositions, setOpenPositions] = useState([]);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [zenMode, setZenMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [marketData, setMarketData] = useState([]);

    // Layout Editing State
    const [showEditModal, setShowEditModal] = useState(false);
    const [visibleComponents, setVisibleComponents] = useState({
        stats: true,
        chart: true,
        positions: true,
        signals: true,
        history: true
    });

    const toggleComponent = (id) => {
        setVisibleComponents(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const fetchData = async () => {
        try {
            const identifier = user?.username || user?.email;
            if (identifier) {
                // Fetch User Stats
                const response = await api.get(`/api/challenge?email=${identifier}`);
                if (response.data) {
                    setStats({
                        balance: response.data.balance,
                        equity: response.data.equity,
                        profit: response.data.profit,
                        profit_percent: response.data.profit_percent,
                        drawdown: response.data.drawdown,
                        status: response.data.status
                    });
                    setOpenPositions(response.data.open_positions || []);
                    setTradeHistory(response.data.trades || []);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Fallback: afficher des stats par défaut pour éviter un dashboard vide
            setStats((prev) => prev || {
                balance: 5000,
                equity: 5000,
                profit: 0,
                profit_percent: 0,
                drawdown: 0,
                status: 'ACTIVE'
            });
        }
    };

    const fetchMarketData = async () => {
        try {
            const response = await api.get('/api/trading/market-data/global');
            if (response.data && Array.isArray(response.data)) {
                setMarketData(response.data);
            }
        } catch (error) {
            console.error("Error fetching global market data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchMarketData();

        const interval = setInterval(() => {
            fetchData();
            fetchMarketData(); // Refresh market data too
        }, 5000);

        return () => clearInterval(interval);
    }, [user]);

    const handleTradeComplete = (trade) => {
        fetchData();
        toast({
            title: trade.side === 'BUY' ? "Ordre d'Achat Exécuté" : "Ordre de Vente Exécuté",
            description: `${trade.amount} de ${trade.ticker} au prix de ${trade.entry_price}`,
            variant: "default",
            className: "bg-cyan-900 border-cyan-500 text-white"
        });
    };

    const closePosition = async (positionId) => {
        try {
            const identifier = user?.username || user?.email; // Consistent with fetchData
            const response = await api.post('/api/trading/trade/close', {
                email: identifier,
                position_id: positionId
            });

            toast({
                title: "Position Clôturée",
                description: `P&L: ${formatPrice(response.data.pnl)}`,
                variant: response.data.pnl >= 0 ? "default" : "destructive",
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de clôturer la position",
                variant: "destructive",
            });
        }
    };

    const WidgetHeader = ({ children }) => (
        <div className="absolute top-0 right-0 p-2 z-20 cursor-grab drag-handle opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-slate-500 hover:text-white" />
        </div>
    );

    const [activeCategory, setActiveCategory] = useState('CRYPTO');

    const categoryTickers = {
        'CRYPTO': ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD'],
        'BVC': ['IAM', 'ATW', 'BCP', 'ADH'],
        'FOREX': ['EURUSD', 'USDJPY', 'GBPUSD', 'XAUUSD'],
        'STOCKS': ['AAPL', 'TSLA', 'NVDA', 'MSFT']
    };

    return (
        <div className="flex bg-transparent min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden" >
            {/* Modal */}
            < EditLayoutModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                preferences={visibleComponents}
                onToggle={toggleComponent}
            />

            {/* GLOBAL COMPONENTS */}
            < CommandPalette />
            <AIChatbot />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative transition-all duration-300 md:ml-64">

                {/* Header - Hidden in Zen Mode */}
                {!zenMode && (
                    <header className="flex justify-between items-center p-4 md:p-6 bg-[#0a0f1a] backdrop-blur-md sticky top-0 z-30 border-b border-cyan-900/30 shadow-lg shadow-cyan-900/20">
                        <div className="flex items-center">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 p-2 hover:bg-white/5 rounded-lg transition-colors md:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                    {new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'}, {user?.username}
                                </h1>
                                <p className="text-xs text-muted-foreground font-mono tracking-wide">
                                    TradeSense Pro Terminal <span className="text-cyan-500">v2.4.0</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Ticker Selector */}
                            <div className="flex items-center space-x-2 bg-[#0a0f1a] p-1.5 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-900/10">
                                {/* Category Buttons */}
                                <div className="flex bg-[#0a0f1a]/50 rounded-lg p-1 space-x-1">
                                    {Object.keys(categoryTickers).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setTicker(categoryTickers[cat][0]);
                                            }}
                                            className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all ${activeCategory === cat
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                                {/* Quick Tickers based on active category */}
                                <div className="flex gap-1">
                                    {categoryTickers[activeCategory].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTicker(t)}
                                            className={`hidden md:block px-3 py-1.5 rounded text-xs font-bold transition-all ${ticker === t ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}

                                    {/* Show current ticker if not in list */}
                                    {!categoryTickers[activeCategory].includes(ticker) && (
                                        <button className="px-3 py-1.5 rounded text-xs font-bold bg-white/10 text-white border border-white/20">
                                            {ticker}
                                        </button>
                                    )}
                                </div>

                                {/* Extended Asset Menu Trigger (Mock) */}
                                <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </header>
                )}

                {!zenMode && visibleComponents.stats && (
                    <div className="px-4 md:px-6 py-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                        <ChallengeStats stats={stats} />
                    </div>
                )}

                {stats?.status === 'FAILED' && (
                    <div className="mx-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center justify-between animate-pulse">
                        <div className="flex items-center text-red-400">
                            <span className="text-2xl mr-3">💀</span>
                            <div>
                                <h3 className="font-bold">Challenge Échoué</h3>
                                <p className="text-sm opacity-80">La limite de perte a été atteinte. Réessayez un nouveau challenge.</p>
                            </div>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20">
                            Reset Account
                        </button>
                    </div>
                )}

                <div className="p-4 md:p-6 pb-24 flex-1 h-full">
                    <div className="max-w-[2000px] mx-auto h-full">

                        <div className="flex justify-end mb-4 gap-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${showEditModal ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                            >
                                <Layout className="w-3 h-3" />
                                Edit Layout
                            </button>
                            <button
                                onClick={() => setZenMode(!zenMode)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${zenMode ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
                            >
                                {zenMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                                {zenMode ? 'Quitter Mode Zen' : 'Mode Zen'}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {visibleComponents.chart && (
                                <div className="glass-glow rounded-2xl p-2 md:p-3 h-[460px] md:h-[520px]">
                                    <TradingChart ticker={ticker} />
                                </div>
                            )}

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="xl:col-span-2">
                                    {visibleComponents.signals && <SignalPanel ticker={ticker} category={activeCategory} />}
                                </div>
                                <div className="glass-glow rounded-2xl p-4 h-full">
                                    <TradePanel ticker={ticker} onTradeComplete={handleTradeComplete} currentPrice={0} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="glass-glow rounded-2xl p-4 h-[320px]">
                                    <MarketHeatmap data={marketData} />
                                </div>
                                <div className="h-[320px]">
                                    {visibleComponents.positions && <TabbedPositions positions={openPositions} history={tradeHistory} formatPrice={formatPrice} onClosePosition={closePosition} />}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
