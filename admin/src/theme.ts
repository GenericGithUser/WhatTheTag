import { createTheme } from '@mui/material/styles';

// Gruvbox Light Theme Colors
const gruvboxTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#458588', // Gruvbox Blue
      contrastText: '#fbf1c7',
    },
    secondary: {
      main: '#d65d0e', // Gruvbox Orange
      contrastText: '#fbf1c7',
    },
    success: {
      main: '#98971a', // Gruvbox Green
      contrastText: '#fbf1c7',
    },
    warning: {
      main: '#d79921', // Gruvbox Yellow
      contrastText: '#282828',
    },
    error: {
      main: '#cc241d', // Gruvbox Red
      contrastText: '#fbf1c7',
    },
    info: {
      main: '#689d6a', // Gruvbox Aqua
      contrastText: '#fbf1c7',
    },
    background: {
      default: '#fbf1c7', // Gruvbox BG
      paper: '#ebdbb2', // Gruvbox BG1
    },
    text: {
      primary: '#282828', // Gruvbox FG0
      secondary: '#504945', // Gruvbox FG2
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(40, 40, 40, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(40, 40, 40, 0.1)',
        },
      },
    },
  },
});

export default gruvboxTheme;
