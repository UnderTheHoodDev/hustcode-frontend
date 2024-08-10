import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral_content: '#E5E7EB',
        base_content: '#FFFFFF',
        base_100: '#1E293B',
        base_200: '#0B1121',
        primary: '#38BDF8',
        info: '#0E99D9',
        accent: '#4F46E5',
        secondary: '#F472B6',
        neutral: 'rgba(248, 250, 252, 0.10))',
        success: '#00B8A3',
        error: '#FF375F',
        warning: '#FFC01E',
      },
      boxShadow: {},
      screens: {
        '2xl': { max: '1535px' },
        xl: { max: '1279px' },
        lg: { max: '1023px' },
        md: { max: '767px' },
        sm: { max: '639px' },
      },
    },
  },
  plugins: [],
};
export default config;
