/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#6C63FF',
                'primary-light': '#8B85FF',
                'primary-dark': '#5148D9',
                gold: '#FFD700',
                'gold-dark': '#C9A800',
                background: '#121212',
                surface: '#1E1E1E',
                'surface-2': '#2A2A2A',
                'text-primary': '#F5F5F5',
                'text-secondary': '#A0A0A0',
                success: '#4ADE80',
                warning: '#FBBF24',
                danger: '#F87171',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                playfair: ['"Playfair Display"', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #6C63FF 0%, #121212 60%)',
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                glow: '0 0 20px rgba(108, 99, 255, 0.4)',
                'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
            },
            backdropBlur: {
                glass: '12px',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
