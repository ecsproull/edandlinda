import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useDrawer } from "../../src/contexts/drawer";

export default function PageLayout({ children }) {
  const { drawerWidth } = useDrawer();
  return (
    <Box
      sx={{ 
        marginLeft: `${drawerWidth}px`, 
        p: 3,
        width: '100%',
        height: 'calc(100vh - 128px)', // Full height minus the navbar
        maxWidth: 1200,
        mx: 0,
        maxHeight: 'calc(100vh - 128px)', // Maximum height before scrolling
        background: '#f5f5f5',
        overflow: 'auto',
        position: 'relative'
      }}>
      {children}
    </Box>
  );
}