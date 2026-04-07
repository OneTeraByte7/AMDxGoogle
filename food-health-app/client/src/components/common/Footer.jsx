// src/components/common/Footer.jsx
export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-surface/50 mt-auto py-6" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-text-secondary text-sm">
                    Made with <span className="text-danger">❤️</span> by{' '}
                    <span className="gradient-text font-semibold">NutriVita</span> — Your Health, Your Way.
                </p>
                <p className="text-text-secondary text-xs mt-1">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
        </footer>
    );
}
