import React, { Fragment, useState } from "react";
import { Avatar, Box, Icon, IconButton, Menu, 
  MenuItem, Toolbar, Typography } from "@mui/material";

import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { useNavigate, Link } from 'react-router-dom';
import Profile from './profile';
import Users from './users';
import Configurations from './configurations';
import Clientes from "./clientes";
import Contratos from "./contratos";
import Vehiculos from "./vehiculos";
import Equipos from "./equipos";
import Planes from "./planes";

import { useStateValue } from "../context/store";
import { ModeSave, pages,types } from "../types/types";
import useStyle from "../themes/useStyle";

import logo from "../images/logo.png";

const bar_title = 'X-GPS';

const drawerWidth = 200;

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

// const Transition2 = forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// })

const MainPage = () => {
    const [open, setOpen] = useState(false);
    // const [actualPage, ] = useState('');
    const [panelIndex,setPanelIndex] = useState(pages.PAGE_DASHBOARD);
    const [{sesionUsuario},dispatch] = useStateValue();

    const [anchorEl, setAnchorEl] = useState(null);
    const openProfileMenu = Boolean(anchorEl);
    
    const navigate = useNavigate();
    const classes = useStyle();



    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const logOut = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      dispatch({
        type:types.logOut,
        nuevoUsuario: null,
        autenticado: false
      });
      navigate('/',{replace:true})
    }

    const handleOpenDialog = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const Contenedor = (index) => {
      switch(index) 
      {
        case pages.PAGE_PROFILE:
            return <Profile/>;
        case pages.PAGE_USERS: 
            return <Users/>;
        case pages.PAGE_CONFIGURATIONS:
            return <Configurations/>;
        case pages.PAGE_CLIENTS:
            return <Clientes mode={ModeSave.IsADDING}/>;
        case pages.PAGE_CONTRACTS:
            return <Contratos/>;
        case pages.PAGE_VEHICLES:
            return <Vehiculos mode={ModeSave.IsADDING}/>;
        case pages.PAGE_EQUIPMENTS:
            return <Equipos mode={ModeSave.IsADDING}/>;
        case pages.PAGE_PLAINS:
            return <Planes/>;
        case pages.PAGE_INVOICE:
            return <div>INVOICE</div>;
        case pages.PAGE_DASHBOARD:
            return <div style={{backgroundImage:`url(${logo})`
                      ,backgroundRepeat: 'no-repeat'
                      ,height:'185px'
                      ,width:'210px'
                      ,position:'absolute'
                      ,left:'calc(50% - 100px)'
                      ,top:'calc(40% - (150px - 93px))'}}/>
        default:
          return <></>;
      }
    }

    const handleCloseProfileMenu = () => {
      setAnchorEl(null);
    }

    function getTextVisibility(){
      return open ? 1 : 0
    }

    
    return (
      // <Fragment>

        <Box sx={{ display: 'flex'}}>
            <CssBaseline />

{/* ****************************************************************************************************************************** */}
            {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,height:'65px' }}> */}
            <AppBar position="fixed" sx={{height:'65px',backgroundColor: (theme) => theme.palette.primary.main}}>
                <Toolbar>
                    <IconButton
                      size="large" color="inherit" aria-label="open drawer"
                      onClick={handleDrawerOpen} edge="start" sx={{mr:1}}>
                        <Icon fontSize='large'>{open ? 'menu_open' : 'menu'}</Icon>
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }}>
                        <Link onClick={()=>setPanelIndex(pages.PAGE_DASHBOARD)} style={{display:'inline-flex',alignItems:'center',color:'inherit',textDecoration:'none'}}>
                            <Typography variant='h5'>
                                {bar_title}
                            </Typography>
                        </Link>
                    </Box>
                    
                    <div style={{display:'grid',marginBottom:3}}>
                      <IconButton
                        color="inherit"
                        onClick={handleOpenDialog}
                          sx={{width:48,height:48,margin:'auto'}}>
                          <Avatar sx={{ bgcolor: 'white', color:'#0f80aa',width:'35px', height:'35px', fontSize:'19px'}}>
                            {sesionUsuario ? sesionUsuario.usuario ? sesionUsuario.usuario.nombre ? sesionUsuario.usuario.nombre[0].toUpperCase(): 'N' : 'N' : 'N'}
                            {sesionUsuario ? sesionUsuario.usuario ? sesionUsuario.usuario.apellido ? sesionUsuario.usuario.apellido[0].toUpperCase(): 'D' : 'D' : 'D'}
                          </Avatar>
                      </IconButton>

                      <Typography variant="h1" style={{margin:'auto',fontSize:14}}>
                        {sesionUsuario ? sesionUsuario.usuario ? sesionUsuario.usuario.nombre + ' ': 'N' : ''}
                        {sesionUsuario ? sesionUsuario.usuario ? sesionUsuario.usuario.apellido : 'D' : ''}
                      </Typography>
                    </div>

                </Toolbar>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openProfileMenu}
                  onClose={handleCloseProfileMenu}
                  onClick={handleCloseProfileMenu}
                  PaperProps={{
                    elevation: 5,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => setPanelIndex(pages.PAGE_PROFILE)}>
                    <Avatar /> Perfil
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled onClick={handleCloseProfileMenu}>
                    <ListItemIcon>
                      <Icon>settings</Icon>
                    </ListItemIcon>
                    Configuracion
                  </MenuItem>
                  <MenuItem onClick={logOut}>
                    <ListItemIcon>
                      <Icon>logout</Icon>
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>

            </AppBar>
{/* ****************************************************************************************************************************** */}
            <Drawer variant="permanent" open={open}>
                
                <Box sx={{marginTop:'65px'}}>

                    <ListItem key='principal' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              selected={panelIndex===pages.PAGE_DASHBOARD} 
                              onClick={() => setPanelIndex(pages.PAGE_DASHBOARD)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon>home</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Dashboard' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <Divider />
                    
                    <ListItem key='factura' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              selected={panelIndex===pages.PAGE_INVOICE} 
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_INVOICE)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon class="material-symbols-outlined">payments</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Factura' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key='contratos' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              selected={panelIndex===pages.PAGE_CONTRACTS} 
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_CONTRACTS)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon class="material-symbols-outlined">contract</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Contratos' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <Divider />
                    
                    <ListItem key='clientes' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              selected={panelIndex===pages.PAGE_CLIENTS} 
                              classes={{selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_CLIENTS)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon class="material-symbols-outlined">clinical_notes</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Clientes' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key='vehiculos' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              selected={panelIndex===pages.PAGE_VEHICLES} 
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_VEHICLES)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon>airport_shuttle</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Vehiculos' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key='planes' disablePadding className={classes.display_block}>
                      <ListItemButton   
                              selected={panelIndex===pages.PAGE_PLAINS} 
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_PLAINS)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon>format_list_bulleted</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Planes' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key='equipos' disablePadding className={classes.display_block}>
                      <ListItemButton 
                              selected={panelIndex===pages.PAGE_EQUIPMENTS}
                              classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                              onClick={() => setPanelIndex(pages.PAGE_EQUIPMENTS)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon>devices_other</Icon>
                          </ListItemIcon>
                          <ListItemText primary='Equipos' sx={{opacity:getTextVisibility()}} />
                      </ListItemButton>
                    </ListItem>

                </Box>

                <Divider />

                <Box sx={{marginTop:'auto',marginBottom:'16px'}}>
                    
                  <Divider />
                  <ListItem key='configuraciones' disablePadding className={classes.display_block}>
                    <ListItemButton 
                            selected={panelIndex===pages.PAGE_CONFIGURATIONS}
                            classes={{root:classes.menu_item_selected_root, selected:classes.menu_item_selected}}
                            onClick={() => setPanelIndex(pages.PAGE_CONFIGURATIONS)}>
                          <ListItemIcon className={classes.menu_item_icon_root}>
                            <Icon>settings</Icon>
                            </ListItemIcon>
                          <ListItemText primary='Configuraciones' sx={{opacity:getTextVisibility()}} />
                    </ListItemButton>
                  </ListItem>

                </Box>

            </Drawer>
            
{/* ****************************************************************************************************************************** */}
            <Box component="main" className={classes.main_content_area}>
                { Contenedor(panelIndex) }
            </Box>
{/* ****************************************************************************************************************************** */}
          </Box>

        // </Fragment>
    );
}

export default MainPage;