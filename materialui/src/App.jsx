import { lightGrayGradient } from "./consts/consts";
import Navbar from "./components/navbar/navbar";
import Box from '@mui/material/Box';
import Router from "./components/router/router";
import Sidebar from "./components/sidebar/sidebar";
import { useAuth } from "./contexts/authentication";
import { useSEO } from "./components/seo/seohook";


function App() {
  const { isAuthenticated } = useAuth()

  useSEO({
    title: "Ed & Linda's RV Adventures",
    description: "Follow our RV travels and find technical resources for Fleetwood Discovery RVs",
    keywords: "RV travel, Fleetwood Discovery, Fleetwood Discovery LXE, RV manuals, travel blog, camping, road trips, website development, technical resources, working with AI"
  });

  return (
    <Box
      sx={{
        background: 'lightgray'
      }}
    >
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          background: { lightGrayGradient },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
          border: '5px solid #ccc',
          padding: 0,
          overflow: 'hidden',
          mt: '10px'
        }}
      >

        <Navbar />

        <Box sx={{ display: 'flex', width: '100%' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, padding: 0 }}>
            <Router />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
