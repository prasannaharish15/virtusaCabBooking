/**
 * Design Tokens for vCabs Application
 * Ensures visual consistency across Admin, Passenger, and Driver modules
 */

export const DesignTokens = {
  // Color Palette
  colors: {
    primary: {
      purple: {
        50: '#F8F0FB',
        100: '#F3E5F9',
        200: '#E1BEE7',
        300: '#CE93D8',
        400: '#BA68C8',
        500: '#AB47BC', // Main purple
        600: '#9C27B0',
        700: '#8E24AA',
        800: '#7B1FA2',
        900: '#6A1B9A',
        admin: '#A225CC' // Admin specific
      },
      blue: {
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8'
      },
      green: {
        500: '#10B981',
        600: '#059669',
        700: '#047857'
      },
      orange: {
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309'
      }
    },
    neutral: {
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
      }
    },
    background: {
      light: '#F9FAFB',
      admin: '#E6E6E6'
    },
    status: {
      success: {
        bg: '#D1FAE5',
        text: '#065F46'
      },
      warning: {
        bg: '#FEF3C7',
        text: '#92400E'
      },
      error: {
        bg: '#FEE2E2',
        text: '#991B1B'
      },
      info: {
        bg: '#DBEAFE',
        text: '#1E40AF'
      }
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'  // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },

  // Transitions
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Component Specific
  components: {
    card: {
      padding: '2rem',
      borderRadius: '1.5rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    },
    button: {
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem'
      },
      borderRadius: '0.5rem'
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      borderColor: '#E5E7EB'
    }
  }
};

// Tailwind CSS class mappings for easy reference
export const TailwindClasses = {
  // Gradient backgrounds (matching Passenger module)
  gradients: {
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    purpleDark: 'bg-gradient-to-br from-purple-600 to-purple-700',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
    blueToPlurple: 'bg-gradient-to-br from-blue-600 to-purple-600'
  },

  // Card styles
  cards: {
    base: 'bg-white rounded-2xl shadow-md',
    hover: 'hover:shadow-xl transition-all duration-200',
    interactive: 'hover:shadow-xl transition-all duration-200 hover:scale-105'
  },

  // Button styles
  buttons: {
    primary: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-105',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 rounded-2xl hover:bg-purple-50 transition-all duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200'
  },

  // Status badges
  badges: {
    success: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    warning: 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    error: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    info: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    purple: 'px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800'
  },

  // Layout
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8'
  }
};
