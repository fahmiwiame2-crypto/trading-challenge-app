import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TradingChart from '@/components/TradingChart';
import api from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Brain,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const assets = [
  // International assets
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 67432.15, change: 2.34, icon: '₿', market: 'international' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3521.87, change: -0.82, icon: 'Ξ', market: 'international' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 178.32, change: 1.15, icon: '🍎', market: 'international' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 241.56, change: 3.21, icon: '⚡', market: 'international' },
  { symbol: 'EUR/USD', name: 'Euro/Dollar', price: 1.0892, change: 0.12, icon: '€', market: 'international' },

  // Moroccan assets
  { symbol: 'IAM', name: 'Maroc Telecom', price: 102.50, change: 0.5, icon: 'MA', market: 'moroccan' },
  { symbol: 'ATW', name: 'Attijariwafa Bank', price: 520.00, change: -0.2, icon: 'MA', market: 'moroccan' },
  { symbol: 'BCP', name: 'Banque Centrale Populaire', price: 285.00, change: 0.8, icon: 'MA', market: 'moroccan' },
  { symbol: 'ADH', name: 'CDG', price: 1550.00, change: 0.3, icon: 'MA', market: 'moroccan' },
];

const Trading = () => {
  const [aiSignals, setAiSignals] = useState([
    { symbol: 'BTC/USD', signal: 'BUY', confidence: 87, reason: 'Strong bullish momentum, RSI oversold bounce' },
    { symbol: 'AAPL', signal: 'HOLD', confidence: 65, reason: 'Consolidating near resistance, wait for breakout' },
    { symbol: 'TSLA', signal: 'BUY', confidence: 78, reason: 'Positive earnings outlook, volume surge detected' },
  ]);

  const initialAssets = [
    // International assets
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 67432.15, change: 2.34, icon: '₿', market: 'international' },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 3521.87, change: -0.82, icon: 'Ξ', market: 'international' },
    { symbol: 'AAPL', name: 'Apple Inc', price: 178.32, change: 1.15, icon: '🍎', market: 'international' },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 241.56, change: 3.21, icon: '⚡', market: 'international' },
    { symbol: 'EUR/USD', name: 'Euro/Dollar', price: 1.0892, change: 0.12, icon: '€', market: 'international' },

    // Moroccan assets
    { symbol: 'IAM', name: 'Maroc Telecom', price: 102.50, change: 0.5, icon: 'MA', market: 'moroccan' },
    { symbol: 'ATW', name: 'Attijariwafa Bank', price: 520.00, change: -0.2, icon: 'MA', market: 'moroccan' },
    { symbol: 'BCP', name: 'Banque Centrale Populaire', price: 285.00, change: 0.8, icon: 'MA', market: 'moroccan' },
    { symbol: 'ADH', name: 'CDG', price: 1550.00, change: 0.3, icon: 'MA', market: 'moroccan' },
  ];

  const [selectedAsset, setSelectedAsset] = useState(initialAssets[0]);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [lotSize, setLotSize] = useState('0.1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [prices, setPrices] = useState(initialAssets);
  const { toast } = useToast();

  // Fetch AI signals for selected asset
  useEffect(() => {
    const fetchAiSignal = async () => {
      try {
        const response = await api.get(`/api/trading/ai-signals?ticker=${selectedAsset.symbol.replace('/', '-')}`);
        if (response.data) {
          const signal = response.data;
          // Update the signal for the selected asset
          setAiSignals(prev => {
            const existingIndex = prev.findIndex(s => s.symbol === selectedAsset.symbol);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = signal;
              return updated;
            } else {
              // Keep only a few signals for UI clarity
              const updated = prev.slice(0, 2);
              return [signal, ...updated];
            }
          });
        }
      } catch (error) {
        console.error('Error fetching AI signal:', error);
      }
    };

    fetchAiSignal();

    // Refresh AI signals every 30 seconds
    const signalInterval = setInterval(fetchAiSignal, 30000);
    return () => clearInterval(signalInterval);
  }, [selectedAsset]);

  // Fetch live price updates
  useEffect(() => {
    const fetchLivePrices = async () => {
      const updatedPrices = await Promise.all(
        initialAssets.map(async (asset) => {
          try {
            const response = await api.get(`/api/trading/price?ticker=${asset.symbol.replace('/', '-')}`);
            if (response.data && response.data.length > 0) {
              // Get the latest candle data
              const latestCandle = response.data[response.data.length - 1];
              const newPrice = latestCandle.close;

              // Calculate change percentage based on previous price
              const prevPrice = asset.price;
              const change = ((newPrice - prevPrice) / prevPrice) * 100;

              return {
                ...asset,
                price: newPrice,
                change: parseFloat(change.toFixed(2)),
              };
            }
          } catch (error) {
            console.error(`Error fetching price for ${asset.symbol}:`, error);
          }

          // Return original asset if there was an error
          return asset;
        })
      );

      setPrices(updatedPrices);
    };

    // Fetch live prices immediately
    fetchLivePrices();

    // Refresh prices every 10 seconds
    const priceInterval = setInterval(fetchLivePrices, 10000);
    return () => clearInterval(priceInterval);
  }, []);

  const handleExecuteTrade = () => {
    toast({
      title: `${orderType.toUpperCase()} Order Executed`,
      description: `${lotSize} lot(s) of ${selectedAsset.symbol} at $${selectedAsset.price.toLocaleString()}`,
    });
  };

  const currentAsset = prices.find((a) => a.symbol === selectedAsset.symbol) || selectedAsset;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Trading Terminal</h1>
          <p className="text-muted-foreground">Execute trades with real-time market data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Asset Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {prices.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-all ${selectedAsset.symbol === asset.symbol
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <span>{asset.icon}</span>
                  <span className="font-medium">{asset.symbol}</span>
                  <span className={`text-sm trading-number ${asset.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>

            {/* Trading Chart */}
            <div className="glass-glow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentAsset.icon}</span>
                    <span className="text-xl font-bold">{currentAsset.symbol}</span>
                  </div>
                  <div className="text-3xl font-bold trading-number mt-1">
                    ${currentAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${currentAsset.change >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                  {currentAsset.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-medium trading-number">{currentAsset.change >= 0 ? '+' : ''}{currentAsset.change.toFixed(2)}%</span>
                </div>
              </div>

              <TradingChart ticker={selectedAsset.symbol.replace('/', '-')} />
            </div>

            {/* AI Signals */}
            <div className="glass-glow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Trading Signals</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiSignals.slice(0, 3).map((signal, index) => (
                  <div key={signal.symbol || index} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{signal.symbol}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${signal.signal === 'BUY' ? 'bg-success/20 text-success' :
                        signal.signal === 'SELL' ? 'bg-destructive/20 text-destructive' :
                          'bg-warning/20 text-warning'
                        }`}>
                        {signal.signal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm trading-number">{signal.confidence}% confidence</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{signal.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="space-y-4">
            <div className="glass-glow p-6">
              <h2 className="text-lg font-semibold mb-4">Execute Trade</h2>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setOrderType('buy')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${orderType === 'buy'
                    ? 'bg-success text-success-foreground'
                    : 'bg-secondary hover:bg-success/20 text-muted-foreground'
                    }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  BUY
                </button>
                <button
                  onClick={() => setOrderType('sell')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${orderType === 'sell'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary hover:bg-destructive/20 text-muted-foreground'
                    }`}
                >
                  <ArrowDown className="w-4 h-4" />
                  SELL
                </button>
              </div>

              {/* Trade Form */}
              <div className="space-y-4">
                <div>
                  <Label>Lot Size</Label>
                  <Input
                    type="number"
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    className="bg-secondary border-border mt-1"
                    step="0.01"
                    min="0.01"
                  />
                </div>

                <div>
                  <Label>Stop Loss (optional)</Label>
                  <Input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="bg-secondary border-border mt-1"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <Label>Take Profit (optional)</Label>
                  <Input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="bg-secondary border-border mt-1"
                    placeholder="Enter price"
                  />
                </div>

                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Asset</span>
                    <span className="font-medium">{selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium trading-number">
                      ${currentAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lot Size</span>
                    <span className="font-medium">{lotSize}</span>
                  </div>
                </div>

                <Button
                  onClick={handleExecuteTrade}
                  className="w-full"
                  size="lg"
                  variant={orderType === 'buy' ? 'success' : 'destructive'}
                >
                  Execute {orderType.toUpperCase()} Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trading;
