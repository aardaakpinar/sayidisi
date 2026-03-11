tailwind.config = {
    theme: {
        extend: {
            colors: {
                background: '#fff',
                surface: '#000',
                'surface-light': '#fff',
                border: '#000',
                primary: '#22c55e',
                'primary-dark': '#16a34a',
                danger: '#ef4444',
                success: '#22c55e',
                warning: '#f59e0b',
                gold: '#fbbf24',
                silver: '#e5e7eb',
                bronze: '#d97706',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Space Mono', 'monospace'],
                display: ['Bebas Neue', 'sans-serif'],
            },
            borderWidth: {
                '3': '3px',
                '4': '4px',
                '6': '6px',
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shake': 'shake 0.4s ease-in-out',
                'pop': 'pop 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-6px)' },
                    '75%': { transform: 'translateX(6px)' },
                },
                pop: {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' },
                    '100%': { transform: 'scale(1)' },
                }
            }
        }
    }
}