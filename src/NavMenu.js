import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import Projects from './components/projects/Projects';
import Tasks from './components/tasks/Tasks';
import Users from './components/users/Users';
import Checks from './components/checks/Checks';
import Time from './components/time/Time';
import Profile from './components/profile/Profile';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavMenu({notifyLogOut}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState('Проекты');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (text) => () => {
    setSelectedItem(text);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selectedItem}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {name:'Проекты', icon: <AccountTreeIcon />},
            {name:'Задачи', icon: <AssignmentIcon />},
            {name:'Пользователи', icon: <PeopleIcon />},
            {name:'Проверки', icon: <LibraryAddCheckIcon />},
            {name:'Время', icon: <AccessTimeFilledIcon />}
          ].map((item) => (
            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5}}
                onClick={handleMenuItemClick(item.name)}
              >
                <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[{name:'Профиль', icon: <AccountBoxIcon />}].map((item) => (
            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton sx={{minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5}}
                onClick={handleMenuItemClick(item.name)}
              >
                <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        { selectedItem == 'Проекты' && <Projects /> }
        { selectedItem == 'Задачи' && <Tasks /> }
        { selectedItem == 'Пользователи' && <Users /> }
        { selectedItem == 'Проверки' && <Checks /> }
        { selectedItem == 'Время' && <Time /> }
        { selectedItem == 'Профиль' && <Profile notifyLogOut={notifyLogOut} /> }
      </Box>
    </Box>
  );
}