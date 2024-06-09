import React, { forwardRef, useEffect, useReducer, useState } from "react";
import { Box, Icon, Tooltip, Grid, Divider, Button, List, ListItem, ListItemButton, IconButton, TextField, InputAdornment, Dialog, Slide, AppBar, Typography, Toolbar, FormControl } from "@mui/material";
import { equipoEmpty, vehiculoEmpty } from "../../utils/Entities";
import useStyle from "../../../themes/useStyle";
import './style.css';
import { ModeSave } from "../../../types/types";
import Equipos from "../../equipos";
import { useStateValue } from "../../../context/store";
import { ShowErrorMessage, ShowInfoMessage } from "../../utils/messages";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const EquipoContrato = (props) => {
    // const {  equiposDisponibles, equipo, setEquipo, GoToNextStep, GoToPrevStep } = props;
    const { vehiculos, setVehiculos, GoToNextStep, GoToPrevStep } = props;

    const [equipoContrato, setEquipoContrato] = useState(equipoEmpty);
    // const [vehiculoSelected, setVehiculoSelected] = useState(vehiculoEmpty);
    const [indexVisible, setIndexVisible] = useState(-1);
    const [indexSelected, setIndexSelected] = useState(-1);
    const [modeSave, setModeSave] = useState('');
    const [open, setOpen] = useState(false);

    const [,dispatch] = useStateValue();
    const classes = useStyle();

    


    useEffect(()=>{
        debugger
        if(equipoContrato.equipoId!==0 && equipoContrato.equipoId)
        {
            // setVehiculos((v) => { 
            //     if(v[indexSelected].equipo.equipoId !== equipoContrato.equipoId) 
            //     {
            //         v[indexSelected].equipo = equipoContrato;
            //     }
            //     return v;
            // });

            let vTemp = vehiculos[indexSelected];
            if(vTemp!==undefined && vTemp.equipo.equipoId !== equipoContrato.equipoId){
                let vsTemp = vehiculos.slice();
                vTemp.equipo = equipoContrato;
                vsTemp[indexSelected] = vTemp;
                setVehiculos(vsTemp);
            }
        }
    },[equipoContrato]);

    // useEffect(()=>{
    //     dispatch(ShowInfoMessage("Se agrego al vehiculo: " + indexSelected + ", para el equipo: " + equipoContrato.equipoId ));
    // },[vehiculos]);

    const handleSelectItem = (index) => {
        // if(item.vehiculoId === vehiculoSelected.vehiculoId) {
        //     setVehiculoSelected(vehiculoEmpty);
        // }
        // else{
        //     setVehiculoSelected(item);
        // }
        setIndexVisible(index)
        dispatch(ShowInfoMessage("updated"));
    };

    const handleMouseEnter = (index,value) => {
        setIndexVisible(index);
        setIndexSelected(index);
        setEquipoContrato(value.equipo);
    }

    const handleMouseLeave = () => {
        setIndexVisible(-1);
        setEquipoContrato(equipoEmpty);
    }

    const handleClickOpenForSearch = (index) => {
        setModeSave(ModeSave.IsAddingForSelect);
        setOpen(true);
    };

    const handleClickOpenForAdd = (index) => {
        setModeSave(ModeSave.IsAddingForNew);
        setOpen(true);
    };

    const handleDeleteDevice = (index) => {
        // setVehiculos((v) => { 
        //     v.splice(index,1);
        //     v.push(vehiculoEmpty);
        //     return v;
        //  });

        setVehiculos((v) => { 
            v[indexSelected].equipo = equipoEmpty;
            return v;
        });
    };



    const handleClose = () => {
        // handleSelectItem();
        // debugger

        setVehiculos((v) => { 
            v[indexSelected].equipo = equipoContrato;
            return v;
        });


        setOpen(false);
    };


    return(
        <Box>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Contrato - Equipo</Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            sx={{border:'3px solid white'}}
                            onClick={handleClose}
                            aria-label="close">
                                <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{margin:'5px 5px 0 5px'}}>
                    {/* <Vehiculos setVehiculoContrato={setVehiculoContrato} mode={modeSave} handleClose={handleClose} /> */}
                    <Equipos setEquipoContrato={setEquipoContrato} mode={modeSave} handleClose={handleClose} />
                </Box>
            </Dialog>

            <div className="body_equipo_contrato">

                <Box className='navigation_bar'>
                    <Tooltip title="Paso previo" arrow enterDelay={1000}>
                        <Button className="boton_id_prev" onClick={GoToPrevStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_before</Icon>
                        </Button>
                    </Tooltip>
                    <Box sx={{ flex: '1 1 auto'}}>
                        <div className="title">Equipos</div>
                    </Box>
                    <Tooltip title="Paso siguiente" arrow enterDelay={1000}>
                        {/* <Button disabled={!(equipoContrato.equipoId > 0)} className="boton_id_next" onClick={GoToNextStep}> */}
                        <Button className="boton_id_next" onClick={GoToNextStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_next</Icon>
                        </Button>
                    </Tooltip>
                </Box>

                <Divider/>
                
                <Box className='info_area'>
                    
                    <Box className="vehiculos">

                        <List className="lista">
                            {vehiculos.map((value,index) => {
                                return (
                                <ListItem>
                                    <ListItemButton 
                                        classes={{root:'root_item', selected:'selected_item'}}
                                        onMouseEnter={()=>handleMouseEnter(index,value)}
                                        onMouseLeave={handleMouseLeave}
                                        // selected={ value.vehiculoId === vehiculoSelected.vehiculoId }
                                        // onClick={()=>handleSelectItem(index)}
                                    >
                                            <div className="item_name">{value.marca}</div>
                                            <div className="item_description">{value.modelo} - {value.anio} - {value.color}</div>
                                            <div className="item_patent">{value.placa}</div>
                                            
                                            {/* <div style={{visibility: indexVisible === index ?'hidden':'visible' }} className="item_device"> */}
                                            <div className="item_device">
                                                {value.equipo.equipoId===0 
                                                ? <div className="item_device_no_asignado">Sin Equipo Asig.</div>
                                                : <div className="item_device_asignado">{value.equipo.numeroIMEI}</div>
                                                }
                                                {/* <div className="item_device_asignado">{value.equipo.numeroIMEI}</div> */}
                                            </div>

                                            <div style={{visibility: indexVisible !== index ?'hidden':'visible' }} className="item_options">
                                                <IconButton className="boton_option" sx={{visibility: indexVisible !== index ?'hidden':'visible' }}
                                                     onClick={()=>handleClickOpenForAdd(index)}>
                                                    <Icon className="material-symbols-outlined" fontSize="small">add</Icon>
                                                </IconButton>

                                                <IconButton className="boton_option" sx={{visibility: indexVisible !== index ?'hidden':'visible' }}
                                                    onClick={()=>handleClickOpenForSearch(index)}>
                                                    <Icon className="material-symbols-outlined" fontSize="small">search</Icon>
                                                </IconButton>
                                                
                                                <IconButton className="boton_delete" sx={{visibility: indexVisible !== index ?'hidden':'visible' }}
                                                    onClick={()=>handleDeleteDevice(index)}>
                                                    <Icon className="material-symbols-outlined" fontSize="small">delete</Icon>
                                                </IconButton>
                                            </div>
                                        </ListItemButton>
                                </ListItem>
                                );
                            })}
                        </List>

                    </Box>

                    <Grid container spacing={2} className="grid">
                        
                        <Grid item xs={12} md={6}>
                            <TextField label="Marca"
                                value={equipoContrato.marca ?? ''}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                name='marca'
                                InputProps={{readOnly: true,}}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Modelo"
                                value={equipoContrato.modelo ?? ''}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='modelo'/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Numero IMEI"
                                value={equipoContrato.numeroIMEI ?? ''}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='numeroIMEI'/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Numero SIND CARD"
                                value={equipoContrato.numeroSindCard ?? ''}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='numeroSindCard'/>
                        </Grid>

                    </Grid>

                </Box>
                
            </div>
            

        </Box>
        );
    }
    
export default EquipoContrato;