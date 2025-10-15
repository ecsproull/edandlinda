import { useNavigate } from 'react-router-dom';
import { 
  Drawer, 
  Typography, 
  List, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon, 
  Collapse, 
  Skeleton 
} from '@mui/material';
import { useDrawer } from '../../contexts/drawer';
import { useState, useMemo } from 'react';
import sidebarListItems from '../../consts/sidebarListItems';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../contexts/authentication';

export default function Sidebar() {
  const { user, loading, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const { drawerWidth } = useDrawer();
  const [openItems, setOpenItems] = useState({});

   //console.log('Sidebar render - User:', user, 'Loading:', loading, 'User Role:', user?.role);

  const filteredItems = useMemo(() => {
    if (loading || !user) {
      return sidebarListItems.filter(item => 
        !item.allowedRoles || item.allowedRoles.includes('User')
      );
    }

    return sidebarListItems
      .filter(item => {
        // If no allowedRoles specified, allow all authenticated users
        if (!item.allowedRoles) return true;
        
        // Check if user has any of the allowed roles
        return hasAnyRole(item.allowedRoles);
      })
      .map(item => {
        const filteredItem = { ...item };

        // Filter sub-items if they exist
        if (item.subItems) {
          filteredItem.subItems = item.subItems.filter(subItem => {
            // If no allowedRoles specified, allow all authenticated users
            if (!subItem.allowedRoles) return true;
            
            // Check if user has any of the allowed roles
            return hasAnyRole(subItem.allowedRoles);
          });
        }

        return filteredItem;
      })
      .filter(item => {
        // Remove parent items that have no visible sub-items
        if (item.subItems && item.subItems.length === 0 && !item.path) {
          return false;
        }
        return true;
      });
  }, [user, loading, hasAnyRole]);

  const handleClick = (itemId, route) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    if (route) {
      navigate(route);
    }
  };

  // Show loading state with skeleton while auth is checking
  if (loading) {
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            minHeight: '100vh',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {[1, 2, 3, 4, 5].map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>
                  <Skeleton variant="text" width="80%" />
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    );
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          minHeight: '100vh',
          transition: 'width 0.3s ease-in-out, transform 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (hasSubItems) {
                      handleClick(item.id, item.route);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    transition: 'background-color 0.2s ease, transform 0.1s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'left',
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                  {hasSubItems && (
                    <div style={{ color: 'white' }}>
                      {openItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                    </div>
                  )}
                </ListItemButton>
              </ListItem>

              {hasSubItems && (
                <Collapse in={openItems[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <ListItem key={subItem.id} disablePadding>
                          <ListItemButton
                            sx={{ 
                              pl: 4,
                              minHeight: 40,
                              transition: 'background-color 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              },
                            }}
                            onClick={() => navigate(subItem.path)}
                          >
                            <ListItemIcon sx={{ color: 'white', minWidth: 32 }}>
                              <SubIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    color: 'white',
                                    textAlign: 'left',
                                  }}
                                >
                                  {subItem.label}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
      <Divider />
    </Drawer>
  );
}