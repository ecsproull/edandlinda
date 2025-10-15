import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5', // Example background color
      paper: '#eeeeee',
    },
  },
  components: {
    // Custom component styles
    MuiPaper: {
      variants: [
        {
          props: { variant: 'gradient' },
          style: {
            background: 'linear-gradient(135deg,rgba(75, 81, 114, 0.62),rgb(202, 199, 191))',
            color: 'white',
          },
        },
        {
          props: { variant: 'gradientSecondary' },
          style: {
            background: 'linear-gradient(135deg, #ff7043 0%, #ff5722 100%)',
            color: 'white',
          },
        },
        {
          props: { variant: 'gradientLight' },
          style: {
            background: 'linear-gradient(135deg, #eeeeee 0%, #cccccc 100%)',
            color: 'white',
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1976d2 0%, #43cea2 100%)',
          color: 'white',
        },
      },
    },
    MuiDrawer: {
      variants: [
        {
          props: { variant: 'permanent' },
          style: {
            '& .MuiDrawer-paper': {
              background: 'linear-gradient(135deg, #1976d2 0%, #43cea2 100%)',
              color: 'white',
            }
          },
        },
      ],
    },
  },
  // You can add typography, spacing, etc. here
});

export default theme;