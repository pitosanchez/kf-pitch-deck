/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2C3E50',
                secondary: '#34495E',
                accent: '#E74C3C',
                background: '#F8F9FA',
                text: '#2C3E50',
            },
            fontFamily: {
                'playfair': ['"Playfair Display"', 'serif'],
                'roboto': ['Roboto', 'sans-serif'],
            },
            spacing: {
                'section': '80px',
                'section-lg': '120px',
            },
            boxShadow: {
                'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'custom': '12px',
            },
        },
    },
    plugins: [],
} 