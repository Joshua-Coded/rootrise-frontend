import { extendTheme } from "@chakra-ui/react";

// Remove the ThemeConfig import - it's not needed for basic theme setup
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#e6f7f0',
    100: '#b3e8d1',
    200: '#80d9b2',
    300: '#4dca93',
    400: '#1abb74',
    500: '#2E8B57', // Primary Forest Green
    600: '#267a4e',
    700: '#1e6945',
    800: '#16583c',
    900: '#0e4733',
  },
  secondary: {
    50: '#e6f3ff',
    100: '#b3d9ff',
    200: '#80bfff',
    300: '#4da6ff',
    400: '#1a8cff',
    500: '#1E90FF', // Sky Blue
    600: '#1a7ae6',
    700: '#1664cc',
    800: '#124eb3',
    900: '#0e3899',
  },
  accent: {
    50: '#fffbf0',
    100: '#fff2cc',
    200: '#ffe999',
    300: '#ffe066',
    400: '#ffd733',
    500: '#FFD700', // Golden Yellow
    600: '#e6c200',
    700: '#ccad00',
    800: '#b39900',
    900: '#998400',
  },
  success: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#32CD32', // Lime Green
    600: '#2bb728',
    700: '#24a01e',
    800: '#1d8914',
    900: '#16720a',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
};

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'brand.700',
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
          transform: 'translateY(-1px)',
        },
      },
      ghost: {
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
    sizes: {
      lg: {
        h: 12,
        px: 8,
        fontSize: 'lg',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.200',
        _hover: {
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s',
      },
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: 'gray.50',
          borderRadius: 'lg',
          _hover: {
            bg: 'gray.100',
          },
          _focus: {
            bg: 'white',
            borderColor: 'brand.500',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Progress: {
    baseStyle: {
      track: {
        borderRadius: 'full',
      },
      filledTrack: {
        borderRadius: 'full',
        bgGradient: 'linear(to-r, brand.400, brand.600)',
      },
    },
  },
  Badge: {
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
      },
      outline: {
        color: 'brand.500',
        borderColor: 'brand.500',
      },
    },
  },
  Stat: {
    baseStyle: {
      container: {
        bg: 'white',
        p: 6,
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'gray.200',
        _hover: {
          boxShadow: 'md',
        },
        transition: 'all 0.2s',
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
    '*::placeholder': {
      color: 'gray.400',
    },
    '*, *::before, &::after': {
      borderColor: 'gray.200',
    },
  },
};

const shadows = {
  outline: '0 0 0 3px rgba(46, 139, 87, 0.6)',
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
  shadows,
  space: {
    '4.5': '1.125rem',
    '5.5': '1.375rem',
  },
  sizes: {
    '4.5': '1.125rem',
    '5.5': '1.375rem',
  },
});