// src/main.jsx — Application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1E1E1E',
                            color: '#F5F5F5',
                            border: '1px solid rgba(108,99,255,0.3)',
                            fontFamily: 'Poppins, sans-serif',
                        },
                        success: { iconTheme: { primary: '#6C63FF', secondary: '#F5F5F5' } },
                        error: { iconTheme: { primary: '#F87171', secondary: '#F5F5F5' } },
                    }}
                />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
