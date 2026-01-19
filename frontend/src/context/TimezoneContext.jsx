import React, { createContext, useState, useEffect, useContext } from 'react';

const TimezoneContext = createContext();

export const useTimezone = () => useContext(TimezoneContext);

export const TimezoneProvider = ({ children }) => {
    // Default to Casablanca as requested implicitly by user location/interest or generic UTC
    // Using 'Africa/Casablanca' as default since user mentioned "GMT+1 (Casablanca)"
    const [timezone, setTimezone] = useState('Africa/Casablanca');

    useEffect(() => {
        const savedTimezone = localStorage.getItem('timezone');
        if (savedTimezone) {
            setTimezone(savedTimezone);
        }
    }, []);

    const updateTimezone = (tz) => {
        setTimezone(tz);
        localStorage.setItem('timezone', tz);
    };

    const value = {
        timezone,
        setTimezone: updateTimezone,
        timezones: [
            { label: 'GMT+1 (Casablanca)', value: 'Africa/Casablanca' },
            { label: 'GMT+0 (London)', value: 'Europe/London' },
            { label: 'GMT+1 (Paris)', value: 'Europe/Paris' },
            { label: 'GMT-5 (New York)', value: 'America/New_York' },
            { label: 'GMT+4 (Dubai)', value: 'Asia/Dubai' },
            { label: 'GMT+9 (Tokyo)', value: 'Asia/Tokyo' },
        ]
    };

    return (
        <TimezoneContext.Provider value={value}>
            {children}
        </TimezoneContext.Provider>
    );
};
