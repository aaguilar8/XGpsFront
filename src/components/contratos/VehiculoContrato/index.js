import React, { forwardRef, useEffect, useState } from "react";
import { Box, Icon, IconButton, Toolbar, Tooltip, Grid, TextField, Divider, Button, 
    InputAdornment, Slide, Dialog, AppBar, Typography, 
    List,
    ListItem,
    ListItemButton,
    Fab} from "@mui/material";
import useStyle from "../../../themes/useStyle";
import { ModeSave } from "../../../types/types";
import Vehiculos from "../../vehiculos";
import './style.css';
import { equipoEmpty, vehiculoEmpty } from "../../utils/Entities";
import { useStateValue } from "../../../context/store";
import { ShowInfoMessage } from "../../utils/messages";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const VehiculoContrato = (props) => {

    const { vehiculos, setVehiculos, GoToNextStep, GoToPrevStep } = props;
    
    // const [vehiculoContrato,setVehiculoContrato] = useState(vehiculo);
    const [vehiculoContrato,setVehiculoContrato] = useState(vehiculoEmpty);
    const [vehiculoSeleccionado,setVehiculoSeleccionado] = useState(vehiculoEmpty);
    
    const [modeSave, setModeSave] = useState('');
    const [open, setOpen] = useState(false);
    const classes = useStyle();

    const [indexVisible,setIndexVisible] = useState(-1);

    const [,dispatch] = useStateValue();

    useEffect(() => {
        let existe = vehiculos.filter((item) => {return item.vehiculoId === vehiculoContrato.vehiculoId});

        if(existe.length === 0) {
            let temp=vehiculos.slice();
            for (var i = 0; i < vehiculos.length; i++){
                if(temp[i].vehiculoId===0){
                    // temp[i]=vehiculoContrato;
                    let vehiculoTemp = {
                        vehiculoId: vehiculoContrato.vehiculoId,
                        placa: vehiculoContrato.placa,
                        marca: vehiculoContrato.marca,
                        modelo: vehiculoContrato.modelo,
                        anio: vehiculoContrato.anio,
                        numeroVin: vehiculoContrato.numeroVin,
                        chasis: vehiculoContrato.chasis,
                        color: vehiculoContrato.color,
                        esFinanciado: vehiculoContrato.esFinanciado,
                        financiadoPor: vehiculoContrato.financiadoPor,
                        equipo: equipoEmpty
                        // {
                        //     equipoId:0,
                        //     marca:'',
                        //     modelo:'',
                        //     numeroIMEI:'',
                        //     numeroSindCard:''
                        // }
                    };
                    temp[i]=vehiculoTemp;
                    break;
                }
            }
            setVehiculos(temp);
        }
    },[vehiculoContrato]);

    const handleClickOpenForSearch = () => {
        setModeSave(ModeSave.IsAddingForSelect);
        setOpen(true);
    };

    const handleClickOpenForAdd = () => {
        setModeSave(ModeSave.IsAddingForNew);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMouseEnter = (index) => {
        setIndexVisible(index);      
    }

    const handleMouseLeave = () => {
        setIndexVisible(-1);
    }

    const handleDeleteVehicle = (index) => {
        // let temp = vehiculos.slice();
        // temp.splice(index,1);
        // temp.push(vehiculoEmpty);
        // setVehiculos(temp);

        setVehiculos((v) => { 
            v.splice(index,1);
            v.push(vehiculoEmpty);
            return v;
         });
        // setVehiculoContrato(vehiculoEmpty);
    }

    // const handleSelectItem = (item) => {
    const handleSelectItem = (index) => {
        let item = vehiculos[index];
        if(item.vehiculoId === vehiculoContrato.vehiculoId){
            setVehiculoContrato(vehiculoEmpty);
        }
        else{
            setVehiculoContrato(item);
        }
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
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Contrato - Vehiculo</Typography>
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
                    <Vehiculos setVehiculoContrato={setVehiculoContrato} mode={modeSave} handleClose={handleClose} />
                </Box>
            </Dialog>

            <div className="body_vehiculo_contrato">

                <Box className='navigation_bar'>
                    <Tooltip title="Paso previo" arrow enterDelay={1000}>
                        <Button className="boton_id_prev" onClick={GoToPrevStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_before</Icon>
                        </Button>
                    </Tooltip>
                    <Box sx={{ flex: '1 1 auto'}}>
                        <div className="title">Vehiculo</div>
                    </Box>
                    <Tooltip title="Paso siguiente" arrow enterDelay={1000}>
                        {/* <Button disabled={!(vehiculo.vehiculoId > 0)} className="boton_id_next" onClick={GoToNextStep}> */}
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
                                    {value.vehiculoId===0 
                                    ? <ListItemButton className="empty_item">
                                            <div className="title">
                                                Ingrese vehiculo {index+1}
                                            </div>
                                      </ListItemButton>
                                    : <ListItemButton 
                                        classes={{root:'root_item', selected:'selected_item'}}
                                        onMouseEnter={()=>handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                        selected={ value.vehiculoId === vehiculoContrato.vehiculoId }
                                        onClick={()=>handleSelectItem(index)}
                                        >
                                            <div className="item_name">{value.marca}</div>
                                            <div className="item_description">{value.modelo} - {value.anio} - {value.color}</div>
                                            <div className="item_price">
                                                {value.placa}
                                            </div>
                                            <div className="item_delete">
                                                <IconButton className="boton_delete" 
                                                    sx={{visibility: indexVisible !== index ?'hidden':'visible' }}
                                                    onClick={()=>handleDeleteVehicle(index)}
                                                >
                                                    <Icon fontSize="small">delete</Icon>
                                                </IconButton>
                                            </div>
                                        </ListItemButton>
                                    }
                                    
                                </ListItem>
                                );
                            })}
                        </List>

                    </Box>

                    <Grid container spacing={2} className="grid">
                        <Grid item xs={12} md={6}>
                            <TextField label="Placa"
                                value={vehiculoContrato?.placa==='' ? ' ': vehiculoContrato.placa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                name='placa'
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: 
                                        <InputAdornment position="end">
                                            <Tooltip title="Buscar cliente" arrow enterDelay={1000}>
                                                <IconButton className="boton_id_cliente" onClick={handleClickOpenForSearch}>
                                                    <Icon sx={{color:'#0f80aa'}} fontSize='small'>search</Icon>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Crear cliente" arrow enterDelay={1000}>
                                                <IconButton className="boton_id_cliente" onClick={handleClickOpenForAdd}>
                                                    <Icon sx={{color:'#0f80aa'}} fontSize='small'>add</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Marca"
                                value={vehiculoContrato?.marca==='' ? ' ':  vehiculoContrato.marca}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='marca'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Modelo"
                                value={vehiculoContrato?.modelo==='' ? ' ':  vehiculoContrato.modelo}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='modelo'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Año"
                                value={vehiculoContrato.anio===null ? ' ':  vehiculoContrato.anio}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='anio'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Color"
                                value={vehiculoContrato?.color==='' ? ' ':  vehiculoContrato.color}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='color'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="NumeroVin"
                                value={vehiculoContrato?.numeroVin==='' ? ' ':  vehiculoContrato.numeroVin}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='numeroVin'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Chasis"
                                value={vehiculoContrato?.chasis==='' ? ' ':  vehiculoContrato.chasis}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='chasis'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Financiado Por"
                                value={vehiculoContrato?.financiadoPor==='' ? ' ':  vehiculoContrato.financiadoPor}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='financiadoPor'/>
                        </Grid>
                    </Grid>
                    
                </Box>
            </div>

        </Box>
    );
}

export default VehiculoContrato;