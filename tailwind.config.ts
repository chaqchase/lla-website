import { withTV } from 'tailwind-variants/transformer'
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx,md,mdx}', './content/**/*.{md,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono]
      },
      maxWidth: {
        '8xl': '90rem'
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)'
      },
      colors: {
        border: 'hsl(var(--border))',
        link: 'hsl(var(--link))',
        input: 'hsl(var(--input))',
        toggle: 'hsl(var(--toggle))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        fg: 'hsl(var(--fg))',
        surface: 'hsl(var(--surface))',
        terminal: '#101010',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          fg: 'hsl(var(--primary-fg))',
          '50': '#fff7ed',
          '100': '#ffedd5',
          '200': '#fed7aa',
          '300': '#fdba74',
          '400': '#ff9340',
          '500': '#FF7300',
          '600': '#ea6000',
          '700': '#c24d00',
          '800': '#9a3d00',
          '900': '#7c3200',
          '950': '#451a00'
        },
        orange: {
          '50': '#fff7ed',
          '100': '#ffedd5',
          '200': '#fed7aa',
          '300': '#fdba74',
          '400': '#ff9340',
          '500': '#FF7300',
          '600': '#ea6000',
          '700': '#c24d00',
          '800': '#9a3d00',
          '900': '#7c3200',
          '950': '#451a00'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          fg: 'hsl(var(--secondary-fg))'
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          fg: 'hsl(var(--tertiary-fg))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          fg: 'hsl(var(--success-fg))'
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          fg: 'hsl(var(--danger-fg))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          fg: 'hsl(var(--warning-fg))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          fg: 'hsl(var(--muted-fg))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          fg: 'hsl(var(--accent-fg))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          fg: 'hsl(var(--popover-fg))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          header: 'hsl(var(--card-header))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.18s cubic-bezier(0.23, 1, 0.32, 1)',
        'accordion-up': 'accordion-up 0.14s cubic-bezier(0.23, 1, 0.32, 1)'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-react-aria-components')]
} satisfies Config

export default withTV(config)
