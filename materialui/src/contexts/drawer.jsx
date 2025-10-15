import { createContext, useContext, useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerWidth, setDrawerWidth] = useState(isXs ? 0 : 240);

  useEffect(() => {
    if (isXs) {
      setDrawerWidth(0);
    } else {
      setDrawerWidth(240);
    }
  }, [isXs]);

  const toggleDrawer = () => {
    setDrawerWidth(prev => prev === 240 ? 0 : 240);
  };

  return (
    <DrawerContext.Provider value={{ drawerWidth, setDrawerWidth, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}