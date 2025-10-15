import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawer } from '../../contexts/drawer';
import { useAuth } from '../../contexts/authentication';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {
  AccountCircle,
  Login,
  Logout,
  Person
} from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { drawerWidth, setDrawerWidth } = useDrawer();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function toggleDrawer() {
    setDrawerWidth((prevWidth) => (prevWidth === 240 ? 0 : 240));
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignup = () => {
    handleMenuClose();
    navigate('/signup');
  };

  // Handle login navigation
  const handleLogin = () => {
    handleMenuClose();
    navigate('/signin');
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/home');
  };

  const appBarHeight = 64;

  return (
    <Box>
      <AppBar position="static" variant='permanent'
      >
        <Toolbar sx={{ height: '64px' }}>
          <IconButton
            onClick={() => toggleDrawer()}
            sx={{ ml: -1.5, mr: 2 }}
            color="inherit"
            aria-label="menu"
            edge="start"
            height='24px'
          >
            {drawerWidth === 240 ? <MenuOpenIcon sx={{ height: '45px', width: 'auto' }} /> : <MenuIcon sx={{ height: '45px', width: 'auto' }} />}
          </IconButton >
          <Typography
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1 }}
          >
            Ed & Linda's Home Page
          </Typography>
          {/* User Menu */}
          <Box>
            <IconButton
              onClick={handleMenuClick}
              size="large"
              color="inherit"
              aria-label="user menu"
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {isAuthenticated && user ? (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '1rem'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              ) : (
                <Person sx={{ fontSize: '2rem' }} >X</Person>
              )}
            </IconButton>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiAvatar-root': {
                    width: 24,
                    height: 24,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {isAuthenticated && user ? (
                // Logged in user menu
                [
                  <MenuItem key="user-info">
                    <Avatar sx={{ bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <ListItemText
                      primary={user.name || 'User'}
                      secondary={user.email || ''}
                    />
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="signin" onClick={handleLogin}>
                    <ListItemIcon>
                      <Login fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign In</ListItemText>
                  </MenuItem>,
                  <MenuItem key="signup" onClick={handleSignup}>
                    <ListItemIcon>
                      <PersonAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign Up</ListItemText>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}