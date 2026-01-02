'use client';

import { useState } from 'react';
import './interval-selector.css';

interface IntervalSelectorProps {
    selectedInterval: string;
    onIntervalChange: (interval: string) => void;
}

const INTERVALS = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' },
];

export function IntervalSelector({ selectedInterval, onIntervalChange }: IntervalSelectorProps) {
    return (
        <div className="interval-selector">
            <div className="interval-label">Timeframe</div>
            <div className="interval-buttons">
                {INTERVALS.map((interval) => (
                    <button
                        key={interval.value}
                        className={`interval-btn ${selectedInterval === interval.value ? 'active' : ''}`}
                        onClick={() => onIntervalChange(interval.value)}
                    >
                        {interval.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
