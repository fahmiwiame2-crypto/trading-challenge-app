import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from './ui/Skeleton';

let tvScriptLoadingPromise;

const TradingChart = ({ ticker = 'BTC-USD' }) => {
    const onLoadScriptRef = useRef();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onLoadScriptRef.current = createWidget;

        if (!tvScriptLoadingPromise) {
            tvScriptLoadingPromise = new Promise((resolve) => {
                const script = document.createElement('script');
                script.id = 'tradingview-widget-loading-script';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.type = 'text/javascript';
                script.onload = resolve;

                document.head.appendChild(script);
            });
        }

        tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

        return () => onLoadScriptRef.current = null;

        function createWidget() {
            if (document.getElementById('tradingview_widget_container') && 'TradingView' in window) {
                // Map ticker to TradingView symbol
                let symbol = ticker;
                // Crypto
                if (ticker === 'BTC-USD') symbol = 'BINANCE:BTCUSDT';
                else if (ticker === 'ETH-USD') symbol = 'BINANCE:ETHUSDT';
                else if (ticker === 'SOL-USD') symbol = 'BINANCE:SOLUSDT';

                // BVC (Casablanca)
                // BVC (Casablanca) - Comprehensive Mapping
                else if (['IAM', 'ATW', 'BCP', 'ADH', 'LGB', 'CSR', 'MSA', 'SNE', 'LPC'].includes(ticker)) {
                    symbol = `CSEMA:${ticker}`;
                }

                // Forex
                else if (ticker === 'EURUSD') symbol = 'FX:EURUSD';
                else if (ticker === 'USDJPY') symbol = 'FX:USDJPY';
                else if (ticker === 'GBPUSD') symbol = 'FX:GBPUSD';
                else if (ticker === 'USDCAD') symbol = 'FX:USDCAD';
                else if (ticker === 'XAUUSD') symbol = 'FX:XAUUSD'; // Gold

                new window.TradingView.widget({
                    autosize: true,
                    symbol: symbol,
                    interval: "D",
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "fr", // French locale
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: "tradingview_widget_container",
                    hide_side_toolbar: false,
                    details: false,
                    hotlist: false,
                    calendar: false,
                    toolbar_bg: "#0f0716",
                    theme: "dark",
                    style: "1",
                    locale: "fr",
                    enable_publishing: false,
                    allow_symbol_change: true,
                    // Hide volume if it distracts? No, keep it but maybe minimal.
                    hide_side_toolbar: false, // Keep drawing tools, efficient.
                    // Custom overrides to match TradeSense theme
                    overrides: {
                        "mainSeriesProperties.candleStyle.upColor": "#10b981", // Emerald
                        "mainSeriesProperties.candleStyle.downColor": "#ec4899", // Pink
                        "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
                        "mainSeriesProperties.candleStyle.borderDownColor": "#ec4899",
                        "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
                        "mainSeriesProperties.candleStyle.wickDownColor": "#ec4899",
                        "paneProperties.background": "#1a0b2e",
                        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
                        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
                    }
                });

                // Slight delay to allow iframe to render
                setTimeout(() => setIsLoading(false), 1000);
            }
        }
    }, [ticker]);

    return (
        <div className='tradingview-widget-container' style={{ height: "100%", width: "100%", position: 'relative' }}>
            {isLoading && (
                <div className="absolute inset-0 z-20 bg-[#1a0b2e]">
                    <Skeleton className="h-full w-full rounded-2xl" />
                </div>
            )}
            <div id='tradingview_widget_container' style={{ height: "100%", width: "100%", opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }} />
        </div>
    );
};

export default TradingChart;
