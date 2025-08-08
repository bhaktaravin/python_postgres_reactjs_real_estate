import { createTheme } from '@mui/material/styles'

// Dark theme with colorful accents
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7', // Light blue
      light: '#8bf6ff',
      dark: '#0093c4',
      contrastText: '#000000',
    },
    secondary: {
      main: '#81c784', // Light green
      light: '#b2fab4',
      dark: '#519657',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0e1a', // Very dark blue
      paper: '#1a1f2e', // Dark blue-gray
    },
    surface: {
      main: '#242942', // Medium blue-gray
      light: '#2d3548',
      dark: '#1a1f2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    error: {
      main: '#f48fb1', // Soft pink for errors
      light: '#ffc1e3',
      dark: '#bf5f82',
    },
    warning: {
      main: '#ffb74d', // Warm orange
      light: '#ffcc80',
      dark: '#ff8a65',
    },
    info: {
      main: '#64b5f6', // Soft blue
      light: '#90caf9',
      dark: '#42a5f5',
    },
    success: {
      main: '#81c784', // Light green
      light: '#a5d6a7',
      dark: '#66bb6a',
    },
    divider: '#37474f',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#ffffff',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#e0e0e0',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#b0bec5',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.5)',
    '0px 4px 8px rgba(0, 0, 0, 0.4)',
    '0px 6px 12px rgba(0, 0, 0, 0.3)',
    '0px 8px 16px rgba(0, 0, 0, 0.25)',
    '0px 10px 20px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.15)',
    '0px 14px 28px rgba(0, 0, 0, 0.1)',
    '0px 16px 32px rgba(0, 0, 0, 0.08)',
    '0px 18px 36px rgba(0, 0, 0, 0.06)',
    '0px 20px 40px rgba(0, 0, 0, 0.05)',
    '0px 22px 44px rgba(0, 0, 0, 0.04)',
    '0px 24px 48px rgba(0, 0, 0, 0.03)',
    '0px 26px 52px rgba(0, 0, 0, 0.02)',
    '0px 28px 56px rgba(0, 0, 0, 0.02)',
    '0px 30px 60px rgba(0, 0, 0, 0.02)',
    '0px 32px 64px rgba(0, 0, 0, 0.02)',
    '0px 34px 68px rgba(0, 0, 0, 0.02)',
    '0px 36px 72px rgba(0, 0, 0, 0.02)',
    '0px 38px 76px rgba(0, 0, 0, 0.02)',
    '0px 40px 80px rgba(0, 0, 0, 0.02)',
    '0px 42px 84px rgba(0, 0, 0, 0.02)',
    '0px 44px 88px rgba(0, 0, 0, 0.02)',
    '0px 46px 92px rgba(0, 0, 0, 0.02)',
    '0px 48px 96px rgba(0, 0, 0, 0.02)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1f2e, #242942)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 32px rgba(79, 195, 247, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1a1f2e, #242942)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1a1f2e, #242942)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
          color: '#000',
          '&:hover': {
            background: 'linear-gradient(45deg, #29b6f6, #0288d1)',
            transform: 'translateY(-1px)',
            boxShadow: '0px 6px 20px rgba(79, 195, 247, 0.4)',
          },
        },
        outlined: {
          borderColor: '#4fc3f7',
          color: '#4fc3f7',
          '&:hover': {
            background: 'rgba(79, 195, 247, 0.1)',
            borderColor: '#29b6f6',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 10,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(79, 195, 247, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4fc3f7',
              boxShadow: '0 0 0 2px rgba(79, 195, 247, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
          color: '#000',
        },
        colorSecondary: {
          background: 'linear-gradient(45deg, #81c784, #66bb6a)',
          color: '#000',
        },
        colorError: {
          background: 'linear-gradient(45deg, #f48fb1, #f06292)',
          color: '#000',
        },
        colorWarning: {
          background: 'linear-gradient(45deg, #ffb74d, #ff9800)',
          color: '#000',
        },
        colorSuccess: {
          background: 'linear-gradient(45deg, #81c784, #66bb6a)',
          color: '#000',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
            color: '#000',
            '&:hover': {
              background: 'linear-gradient(45deg, #29b6f6, #0288d1)',
            },
            '& .MuiListItemIcon-root': {
              color: '#000',
            },
          },
          '&:hover': {
            background: 'rgba(79, 195, 247, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1f2e, #242942)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backdropFilter: 'blur(10px)',
        },
        standardError: {
          background: 'linear-gradient(45deg, rgba(244, 143, 177, 0.2), rgba(240, 98, 146, 0.2))',
          border: '1px solid rgba(244, 143, 177, 0.3)',
        },
        standardWarning: {
          background: 'linear-gradient(45deg, rgba(255, 183, 77, 0.2), rgba(255, 152, 0, 0.2))',
          border: '1px solid rgba(255, 183, 77, 0.3)',
        },
        standardInfo: {
          background: 'linear-gradient(45deg, rgba(79, 195, 247, 0.2), rgba(41, 182, 246, 0.2))',
          border: '1px solid rgba(79, 195, 247, 0.3)',
        },
        standardSuccess: {
          background: 'linear-gradient(45deg, rgba(129, 199, 132, 0.2), rgba(102, 187, 106, 0.2))',
          border: '1px solid rgba(129, 199, 132, 0.3)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:hover': {
            background: 'rgba(79, 195, 247, 0.05)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #4fc3f7, #29b6f6)',
          },
          '& .MuiSlider-thumb': {
            background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
            boxShadow: '0px 4px 12px rgba(79, 195, 247, 0.4)',
            '&:hover': {
              boxShadow: '0px 6px 16px rgba(79, 195, 247, 0.6)',
            },
          },
        },
      },
    },
  },
})

// Light theme option (keeping the original as fallback)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
})

export default darkTheme
