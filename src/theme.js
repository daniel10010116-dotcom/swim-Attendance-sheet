import { createTheme } from '@mui/material/styles'

// 依 idea/ui-ux-design-spec.md 設計系統
export const theme = createTheme({
  palette: {
    primary: { main: '#0D9488' },
    secondary: { main: '#0891B2' },
    error: { main: '#DC2626' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' },
  },
  typography: {
    fontFamily: '"Noto Sans TC", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '24px', fontWeight: 700 },
    h2: { fontSize: '20px', fontWeight: 600 },
    body1: { fontSize: '16px', fontWeight: 400 },
    body2: { fontSize: '14px', fontWeight: 400 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
        containedPrimary: { '&:hover': { backgroundColor: '#0F766E' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': { borderColor: '#0D9488' },
          },
        },
      },
    },
  },
})
