import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', name: 'Dollar (USD)', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.93 },
    MAD: { code: 'MAD', symbol: 'DH', name: 'Dirham (MAD)', rate: 9.09 }
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('currency');
        return saved ? JSON.parse(saved) : CURRENCIES.USD;
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    // Helper to format price with conversion
    const formatPrice = (value) => {
        if (value === undefined || value === null) return `${currency.symbol}0.00`;
        const convertedValue = Number(value) * (currency.rate || 1);
        return `${currency.symbol}${convertedValue.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
