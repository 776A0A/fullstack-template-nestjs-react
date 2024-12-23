/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';
import { theme } from 'tailwindcss/defaultConfig';
import plugin from 'tailwindcss/plugin';

const spacing = theme!.spacing!;

const extraSpacing: Record<string, string> = {};
for (let key = 0; key <= 120; key += 0.5) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!spacing[`${key}`]) {
    extraSpacing[`${key}`] = `${key * 0.25}rem`;
  }
}

export default <Config>{
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
  ],
  theme: {
    extend: {
      spacing: { ...extraSpacing },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'var(--radius)',
        sm: 'var(--radius)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          /* Firefox */
          'scrollbar-width': 'thin',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            'border-radius': '3px',
            background: 'rgba(0, 0, 0, 0.2)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.4)',
          },
        },
        '.overflow-y-overlay': {
          'overflow-y': 'overlay',
        },
      };
      addUtilities(newUtilities);
    }),
    plugin(({ addUtilities }) => {
      const utilities = {
        '.border-image-overlay': {
          borderImage: 'linear-gradient(#00000030, #0000007a) fill 1',
        },
        '.border-image-none': {
          borderImage: 'none',
        },
        '.content-visibility-auto': {
          contentVisibility: 'auto',
        },
        '.content-visibility-hidden': {
          contentVisibility: 'hidden',
        },
        '.content-visibility-visible': {
          contentVisibility: 'visible',
        },
        '.contain-intrinsic-size-h-screen': {
          containIntrinsicSize: 'auto 100vh',
        },
      };

      addUtilities(utilities);
    }),
  ],
};
