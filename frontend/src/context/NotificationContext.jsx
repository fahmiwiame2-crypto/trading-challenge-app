import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '../hooks/use-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // Default settings
    const [settings, setSettings] = useState({
        email: true,
        trades: true,
        news: false
    });

    const { toast } = useToast();

    // Load from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('notification_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Update and persist settings
    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('notification_settings', JSON.stringify(updated));

        toast({
            title: "Paramètres mis à jour",
            description: "Vos préférences de notification ont été sauvegardées.",
        });
    };

    // Helper to check if a specific notification type is enabled
    const isEnabled = (type) => {
        return settings[type] === true;
    };

    const value = {
        settings,
        updateSettings,
        isEnabled
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
