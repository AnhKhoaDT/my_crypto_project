'use client';

import { useState } from 'react';
import './symbol-selector.css';

interface SymbolSelectorProps {
    selectedSymbol: string;
    onSymbolChange: (symbol: string) => void;
}

const POPULAR_SYMBOLS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'BNBUSDT', name: 'BNB', icon: 'B' },
    { symbol: 'SOLUSDT', name: 'Solana', icon: 'S' },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: 'A' },
    { symbol: 'XRPUSDT', name: 'Ripple', icon: 'X' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: 'Ð' },
    { symbol: 'DOTUSDT', name: 'Polkadot', icon: 'D' },
];

export function SymbolSelector({ selectedSymbol, onSymbolChange }: SymbolSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedCoin = POPULAR_SYMBOLS.find(s => s.symbol === selectedSymbol);

    const filteredSymbols = POPULAR_SYMBOLS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="symbol-selector">
            <button
                className="symbol-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="selected-symbol">
                    <span className="symbol-icon">{selectedCoin?.icon}</span>
                    <div className="symbol-details">
                        <span className="symbol-name">{selectedCoin?.name}</span>
                        <span className="symbol-pair">{selectedSymbol}</span>
                    </div>
                </div>
                <svg
                    className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="symbol-dropdown-overlay" onClick={() => setIsOpen(false)} />
                    <div className="symbol-dropdown">
                        <div className="dropdown-header">
                            <input
                                type="text"
                                className="symbol-search"
                                placeholder="Search coins..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="symbol-list">
                            {filteredSymbols.map((coin) => (
                                <button
                                    key={coin.symbol}
                                    className={`symbol-item ${coin.symbol === selectedSymbol ? 'active' : ''}`}
                                    onClick={() => {
                                        onSymbolChange(coin.symbol);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    <span className="symbol-icon">{coin.icon}</span>
                                    <div className="symbol-details">
                                        <span className="symbol-name">{coin.name}</span>
                                        <span className="symbol-pair">{coin.symbol}</span>
                                    </div>
                                    {coin.symbol === selectedSymbol && (
                                        <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M16.6667 5L7.50004 14.1667L3.33337 10"
                                                stroke="#26a69a"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
