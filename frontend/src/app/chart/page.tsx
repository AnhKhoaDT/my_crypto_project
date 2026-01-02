'use client';

import { useState } from 'react';
import { TradingChart } from '@/components/chart/TradingChart';
import { IntervalSelector } from '@/components/chart/IntervalSelector';
import { SymbolSelector } from '@/components/chart/SymbolSelector';
import './chart-page.css';

export default function ChartPage() {
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [interval, setInterval] = useState('1h');

    return (
        <div className="chart-page">
            <div className="chart-page-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <span className="title-icon">📊</span>
                        Real-time Trading Chart
                    </h1>
                    <p className="page-subtitle">
                        Professional cryptocurrency trading charts with live price updates
                    </p>
                </div>
            </div>

            <div className="chart-page-content">
                <div className="chart-controls-bar">
                    <SymbolSelector
                        selectedSymbol={symbol}
                        onSymbolChange={setSymbol}
                    />
                    <IntervalSelector
                        selectedInterval={interval}
                        onIntervalChange={setInterval}
                    />
                </div>

                <TradingChart symbol={symbol} interval={interval} />

                <div className="chart-info-cards">
                    <div className="info-card">
                        <div className="card-icon">🔥</div>
                        <div className="card-content">
                            <h3>Live Updates</h3>
                            <p>Real-time price updates every 2 seconds with smooth animations</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">📈</div>
                        <div className="card-content">
                            <h3>Multiple Timeframes</h3>
                            <p>Switch between 1m, 5m, 15m, 1h, 4h, 1d, and 1w intervals</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">💎</div>
                        <div className="card-content">
                            <h3>Top Cryptocurrencies</h3>
                            <p>Track Bitcoin, Ethereum, BNB, Solana, and more popular coins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
