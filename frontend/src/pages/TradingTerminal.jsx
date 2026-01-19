import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TradingChart from '../components/TradingChart';
import TradePanel from '../components/TradePanel';
import SignalPanel from '../components/SignalPanel';
import { BarChart3, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const TradingTerminal = () => {
    const [ticker, setTicker] = useState('BTC-USD');
    const [orderType, setOrderType] = useState('market');

    const assets = {
        crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'ADA-USD', 'XRP-USD'],
        forex: ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCAD=X', 'NZDUSD=X'],
        stocks: ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'],
        bvc: ['IAM', 'ATW', 'BCP', 'ADH', 'CIH', 'LHM'],
    };

    const watchlist = [
        { symbol: 'BTC-USD', price: '$96,234', change: '+2.4%', positive: true },
        { symbol: 'ETH-USD', price: '$3,582', change: '+1.8%', positive: true },
        { symbol: 'SOL-USD', price: '$245', change: '-0.5%', positive: false },
        { symbol: 'AAPL', price: '$194', change: '+0.7%', positive: true },
    ];

    return (
        <div className="flex h-screen bg-[#0f0716] text-white overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-[2000px] mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <BarChart3 className="w-7 h-7 text-purple-400 mr-3" />
                                <div>
                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                        Trading Terminal
                                    </h1>
                                    <p className="text-slate-400 text-sm">Terminal professionnel multi-actifs</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-[#1a0b2e]/60 backdrop-blur-xl rounded-lg border border-purple-500/20 px-3 py-2">
                                <Activity className="w-4 h-4 text-pink-400 mr-2 animate-pulse" />
                                <span className="text-pink-400 font-bold text-xs">LIVE MARKET</span>
                            </div>
                        </div>

                        {/* Main Layout: 3 columns */}
                        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
                            {/* Left Sidebar - Watchlist & Quick Actions */}
                            <div className="col-span-2 flex flex-col gap-4">
                                {/* Watchlist */}
                                <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 flex-1 overflow-y-auto">
                                    <h3 className="text-xs font-bold text-purple-300 uppercase mb-3">Watchlist</h3>
                                    <div className="space-y-2">
                                        {watchlist.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setTicker(item.symbol)}
                                                className={`w-full text-left p-2 rounded-lg transition-all ${ticker === item.symbol
                                                    ? 'bg-purple-600/30 border border-purple-500/50'
                                                    : 'bg-slate-800/30 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <p className="text-white font-bold text-xs">{item.symbol}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-slate-300 text-xs">{item.price}</span>
                                                    <span className={`text-xs font-bold ${item.positive ? 'text-pink-400' : 'text-pink-500'}`}>
                                                        {item.change}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4">
                                    <h3 className="text-xs font-bold text-purple-300 uppercase mb-3">Session</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-xs">Trades</span>
                                            <span className="text-white font-bold text-sm">12</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-xs">Win Rate</span>
                                            <span className="text-pink-400 font-bold text-sm">75%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-xs">P&L Today</span>
                                            <span className="text-pink-400 font-bold text-sm">+$245</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center - Chart & Asset Selector */}
                            <div className="col-span-7 flex flex-col gap-4">
                                {/* Asset Selector - Compact */}
                                <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-xl border border-purple-500/20 p-3">
                                    <div className="grid grid-cols-4 gap-2">
                                        {/* Crypto */}
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1.5 font-bold">Crypto</p>
                                            <div className="flex flex-wrap gap-1">
                                                {assets.crypto.slice(0, 4).map((asset) => (
                                                    <button
                                                        key={asset}
                                                        onClick={() => setTicker(asset)}
                                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${ticker === asset
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        {asset.replace('-USD', '')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Forex */}
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1.5 font-bold">Forex</p>
                                            <div className="flex flex-wrap gap-1">
                                                {assets.forex.slice(0, 4).map((asset) => (
                                                    <button
                                                        key={asset}
                                                        onClick={() => setTicker(asset)}
                                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${ticker === asset
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        {asset.replace('=X', '').slice(0, 6)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stocks */}
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1.5 font-bold">Stocks</p>
                                            <div className="flex flex-wrap gap-1">
                                                {assets.stocks.slice(0, 4).map((asset) => (
                                                    <button
                                                        key={asset}
                                                        onClick={() => setTicker(asset)}
                                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${ticker === asset
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        {asset}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* BVC */}
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase mb-1.5 font-bold">BVC</p>
                                            <div className="flex flex-wrap gap-1">
                                                {assets.bvc.slice(0, 4).map((asset) => (
                                                    <button
                                                        key={asset}
                                                        onClick={() => setTicker(asset)}
                                                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${ticker === asset
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                                            }`}
                                                    >
                                                        {asset}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <span className="text-white font-bold text-lg mr-2">{ticker}</span>
                                            <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded text-xs font-bold">LIVE</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-slate-400">Timeframe:</span>
                                            <select className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-purple-500/20">
                                                <option>1D</option>
                                                <option>4H</option>
                                                <option>1H</option>
                                                <option>15M</option>
                                            </select>
                                        </div>
                                    </div>
                                    <TradingChart ticker={ticker} />
                                </div>
                            </div>

                            {/* Right Sidebar - Trade Execution & Signals */}
                            <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
                                <TradePanel ticker={ticker} onTradeComplete={() => { }} />
                                <SignalPanel ticker={ticker} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingTerminal;
