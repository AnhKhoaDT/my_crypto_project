'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp } from 'lightweight-charts';
import './chart.css';

interface TradingChartProps {
    symbol?: string;
    interval?: string;
}

// Mock data generator
function generateMockCandles(count: number = 100): CandlestickData[] {
    const candles: CandlestickData[] = [];
    let basePrice = 42000;
    const now = Math.floor(Date.now() / 1000);
    const intervalSeconds = 3600; // 1 hour

    for (let i = 0; i < count; i++) {
        const time = (now - (count - i) * intervalSeconds) as UTCTimestamp;

        // Random price movement
        const change = (Math.random() - 0.5) * 1000;
        basePrice += change;

        const open = basePrice;
        const close = basePrice + (Math.random() - 0.5) * 500;
        const high = Math.max(open, close) + Math.random() * 300;
        const low = Math.min(open, close) - Math.random() * 300;

        candles.push({
            time,
            open,
            high,
            low,
            close,
        });

        basePrice = close;
    }

    return candles;
}

export function TradingChart({ symbol = 'BTCUSDT', interval = '1h' }: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [loading, setLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 600,
            layout: {
                background: { color: '#0a0a0a' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#1a1a1a' },
                horzLines: { color: '#1a1a1a' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#758696',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#2962FF',
                },
                horzLine: {
                    color: '#758696',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#2962FF',
                },
            },
            rightPriceScale: {
                borderColor: '#2a2a2a',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
            timeScale: {
                borderColor: '#2a2a2a',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candleSeries = (chart as any).addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Load mock data
    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            const mockCandles = generateMockCandles(200);

            if (candleSeriesRef.current) {
                candleSeriesRef.current.setData(mockCandles);
            }

            // Calculate price stats
            const lastCandle = mockCandles[mockCandles.length - 1];
            const firstCandle = mockCandles[0];
            const change = lastCandle.close - firstCandle.open;
            const changePercent = (change / firstCandle.open) * 100;

            setCurrentPrice(lastCandle.close);
            setPriceChange(change);
            setPriceChangePercent(changePercent);
            setLoading(false);
        }, 500);
    }, [symbol, interval]);

    // Simulate real-time updates
    useEffect(() => {
        const interval_id = setInterval(() => {
            if (!candleSeriesRef.current) return;

            const lastCandle = candleSeriesRef.current as any;
            const now = Math.floor(Date.now() / 1000) as UTCTimestamp;

            // Random price update
            const randomChange = (Math.random() - 0.5) * 100;
            const newPrice = currentPrice + randomChange;

            setCurrentPrice(newPrice);

            // Update chart (simulate new candle)
            candleSeriesRef.current.update({
                time: now,
                open: currentPrice,
                high: Math.max(currentPrice, newPrice) + Math.random() * 50,
                low: Math.min(currentPrice, newPrice) - Math.random() * 50,
                close: newPrice,
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval_id);
    }, [currentPrice]);

    return (
        <div className="trading-chart">
            <div className="chart-header">
                <div className="chart-info">
                    <h2 className="symbol">{symbol}</h2>
                    <div className="price-info">
                        <span className="current-price">
                            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                            {priceChange >= 0 ? '+' : ''}
                            ${Math.abs(priceChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {' '}
                            ({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
                <div className="chart-controls">
                    <span className="interval-badge">{interval}</span>
                    <span className="status-badge live">● Live</span>
                </div>
            </div>

            {loading && (
                <div className="chart-loading">
                    <div className="spinner"></div>
                    <p>Loading chart data...</p>
                </div>
            )}

            <div ref={chartContainerRef} className="chart-container" />

            <div className="chart-footer">
                <div className="chart-stats">
                    <div className="stat-item">
                        <span className="stat-label">24h High</span>
                        <span className="stat-value">${(currentPrice * 1.05).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">24h Low</span>
                        <span className="stat-value">${(currentPrice * 0.95).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">24h Volume</span>
                        <span className="stat-value">1,234.56 BTC</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
