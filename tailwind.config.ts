/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      backgroundImage: {
        'diagonal-lines':
          'repeating-linear-gradient(-45deg, hsl(var(--background)), hsl(var(--border)) 1px, hsl(var(--background)) 1px, hsl(var(--background)) 8px)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-background': 'var(--gradient-background)',
        'space-pattern': 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 80%)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1'
          },
          '20%,50%': {
            opacity: '0'
          }
        },
        'collapsible-down': {
          from: {
            height: '0',
            opacity: '0'
          },
          to: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1'
        }
      },
        'collapsible-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1'
          },
          to: {
            height: '0',
            opacity: '0'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        fadeOut: {
          '0%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        scaleOut: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(0.95)',
            opacity: '0'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'spin-slow': {
          to: {
            transform: 'rotate(360deg)'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.4'
          },
          '50%': {
            opacity: '1'
          }
        },
        'shine-effect': {
          '0%': {
            'background-position': '0% 50%'
          },
          '100%': {
            'background-position': '100% 50%'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shine-effect': 'shine-effect 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
