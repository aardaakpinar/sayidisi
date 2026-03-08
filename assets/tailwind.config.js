tailwind.config = {
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                surface: '#141414',
                'surface-light': '#1a1a1a',
                border: '#2a2a2a',
                primary: '#22c55e',
                'primary-dark': '#16a34a',
                danger: '#ef4444',
                warning: '#f59e0b',
                gold: '#fbbf24',
                silver: '#9ca3af',
                bronze: '#d97706',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-subtle': 'bounce 1s ease-in-out',
                'shake': 'shake 0.5s ease-in-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '75%': { transform: 'translateX(5px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' },
                }
            }
        }
    }
}