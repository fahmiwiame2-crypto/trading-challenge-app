import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { TimezoneProvider } from './context/TimezoneContext';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <CurrencyProvider>
                <TimezoneProvider>
                    <NotificationProvider>
                        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                            <App />
                        </ThemeProvider>
                    </NotificationProvider>
                </TimezoneProvider>
            </CurrencyProvider>
        </LanguageProvider>
    </React.StrictMode>
);
