import React, { forwardRef, useEffect, useState } from "react";
import { Box, Icon, IconButton, Toolbar, Tooltip, Grid, TextField, Divider, 
    Button, InputAdornment, Slide, Dialog, AppBar, Typography, 
    FormControl, Select, MenuItem, DialogTitle, DialogContent, DialogActions,
    backdropClasses} from "@mui/material";
import useStyle from "../../../themes/useStyle";
import Clientes from "../../clientes";
import { ModeSave } from "../../../types/types";
import moment from "moment";
import { NumericFormatCustom } from "../../utils/NumericFormatCustom";
import './style.css';
import { SaveArrowDown } from "../../utils/customIcons";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ClienteContrato = (props) => {

    const { cantidadVehiculos, setCantidadVehiculos, cliente, setCliente, GoToNextStep } = props;
    const [clienteContrato, setClienteContrato] = useState(cliente);
    const [modeSave, setModeSave] = useState('');
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const classes = useStyle();

    const [qty,setQty] = useState(0);
    const [cantidad, setCantidad] = useState(cantidadVehiculos<6 ? cantidadVehiculos>0 ? cantidadVehiculos : 0 : -1);

    useEffect(() => {
        setCliente(clienteContrato);
    },[clienteContrato]);

    const handleClickOpenForSearch = () => {
        setModeSave(ModeSave.IsAddingForSelect);
        setOpen(true);
    };

    const handleClickOpenForAdd = () => {
        setModeSave(ModeSave.IsAddingForNew);
        setOpen(true);
    };
    
    const handleClose = () => {
        setCliente(clienteContrato);
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCantidadVehiculos(qty);
        setCantidad(qty>5 ? -1 : Number(qty));
    };

    const handleChangeVehQty = (e) => {
        const {value} = e.target;
        if (value===-1){
            setOpenDialog(true);
        }
        else{
            setCantidadVehiculos(value);
            setCantidad(value);
        }
    }

    const handleChange = (e) => {
        const {value} = e.target;
        setQty(Number(value));
    }

    const handleGoToNetStep = () => {
        GoToNextStep();
    }

    return(
        <Box>

            <Dialog open={open} onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Contrato - Cliente</Typography>
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
                    <Clientes setClienteContrato={setClienteContrato} mode={modeSave} handleClose={handleClose}/>
                </Box>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Vehiculos por cliente</DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex',flexDirection: 'column',m: 'auto',width: 'fit-content'}}>
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <TextField label="Cantidad"
                                value={cantidadVehiculos}
                                size="small"
                                variant="outlined"
                                fullWidth
                                sx={{marginTop:'8px'}}
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name="cantidadVehiculos"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    inputProps: {decimalScale:0}
                                }}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            <div className="body_cliente_contrato">

                <Box className='navigation_bar'>
                    <Tooltip title="Paso previo" arrow enterDelay={1000}>
                        <Button disabled className="boton_id_prev">
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_before</Icon>
                        </Button>
                    </Tooltip>
                    <Box sx={{ flex: '1 1 auto'}}>
                        <div className="title">Cliente</div>
                    </Box>
                    
                    <FormControl sx={{width:'110px',marginRight:'10px'}} size="small">
                        <Select sx={{height:'30px',fontSize:'12px'}}
                            required
                            value={cantidad}
                            onChange={handleChangeVehQty}
                            name="vehiculos">
                                <MenuItem key="cero" value={0} disabled ><em>Vehiculos</em></MenuItem>
                                <Divider/>
                                <MenuItem key="uno" value={1}>UNO</MenuItem>
                                <MenuItem key="dos" value={2}>DOS</MenuItem>
                                <MenuItem key="tres" value={3}>TRES</MenuItem>
                                <MenuItem key="cuatro" value={4}>CUATRO</MenuItem>
                                <MenuItem key="cinco" value={5}>CINCO</MenuItem>
                                <Divider/>
                                <MenuItem key="otro" value={-1}><em>Otro {cantidadVehiculos>5 ? `(${cantidadVehiculos})` : ''} </em></MenuItem>
                        </Select>
                    </FormControl>

                    <Tooltip title="Paso siguiente" arrow enterDelay={1000}>
                        {/* <Button disabled={!(cliente.id > 0)} className="boton_id_next" onClick={GoToNextStep}> */}
                        <Button className="boton_id_next" onClick={handleGoToNetStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_next</Icon>
                        </Button>
                    </Tooltip>
                </Box>

                <Divider/>

                <Box className='info_area'>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Id Cliente"
                                value={clienteContrato?.clienteId==='' ? ' ': clienteContrato.clienteId}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                name='clienteId'
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
                                        </InputAdornment>
                                }}
                                />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Tipo Sujeto"
                                value={clienteContrato?.tipoSujeto==='' ? ' ':  clienteContrato.tipoSujeto}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='tipoSujeto'/>
                        </Grid>

                        <Grid item xs={2} sm={2} md={4} lg={6} xl={6}>
                        </Grid>

                    </Grid>

                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                            <TextField label="Nombres"
                                value={clienteContrato?.nombres==='' ? ' ':  clienteContrato.nombres}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombres'/>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                            <TextField label="Apellidos"
                                value={clienteContrato?.apellidos==='' ? ' ':  clienteContrato.apellidos}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='apellidos'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Fecha Nacimiento"
                                value={clienteContrato.fechaNacimiento===null ? ' '
                                    :moment(clienteContrato.fechaNacimiento).format("DD/MM/YYYY")}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='fechaNacimiento'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Sexo"
                                value={clienteContrato?.sexo==='' ? ' ':  clienteContrato.sexo}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='sexo'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Tipo Documento"
                                value={clienteContrato?.tipoDocumento==='' ? ' ':  clienteContrato.tipoDocumento}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='tipoDocumento'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Numero documento"
                                value={clienteContrato?.numeroDocumento==='' ? ' ':  clienteContrato.numeroDocumento}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='numeroDocumento'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="RTN"
                                value={clienteContrato?.rtn==='' ? ' ':  clienteContrato.rtn}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='rtn'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={8} lg={3} xl={3}>
                            <TextField label="Correo Electronico"
                                value={clienteContrato?.correoElectronico==='' ? ' ':  clienteContrato.correoElectronico}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='correoElectronico'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 1"
                                value={clienteContrato?.telefono1==='' ? ' ':  clienteContrato.telefono1}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono1'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 2"
                                value={clienteContrato?.telefono2==='' ? ' ':  clienteContrato.telefono2}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono2'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 3"
                                value={clienteContrato?.telefono3==='' ? ' ':  clienteContrato.telefono3}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono3'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Fax"
                                value={clienteContrato?.fax==='' ? ' ':  clienteContrato.fax}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='fax'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nacionalidad Cliente"
                                value={clienteContrato?.nacionalidadCliente==='' ? ' ':  clienteContrato.nacionalidadCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nacionalidadCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={9} xl={9}>
                            <TextField label="Direccion Cliente"
                                value={clienteContrato?.direccionCliente==='' ? ' ':  clienteContrato.direccionCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='direccionCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Pais Cliente"
                                value={clienteContrato?.paisCliente==='' ? ' ':  clienteContrato.paisCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='paisCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Departamento Cliente"
                                value={clienteContrato?.departamentoCliente==='' ? ' ':  clienteContrato.departamentoCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='departamentoCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Municipio Cliente"
                                value={clienteContrato?.municipioCliente==='' ? ' ':  clienteContrato.municipioCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='municipioCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Localidad Cliente"
                                value={clienteContrato?.localidadCliente==='' ? ' ':  clienteContrato.localidadCliente}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='localidadCliente'/>
                        </Grid>

                    </Grid>

                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Empresa"
                                value={clienteContrato?.nombreEmpresa==='' ? ' ':  clienteContrato.nombreEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombreEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Direccion Empresa"
                                value={clienteContrato?.direccionEmpresa==='' ? ' ':  clienteContrato.direccionEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='direccionEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Localidad Empresa"
                                value={clienteContrato?.localidadEmpresa==='' ? ' ':  clienteContrato.localidadEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='localidadEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Ciudad Empresa"
                                value={clienteContrato?.ciudadEmpresa==='' ? ' ':  clienteContrato.ciudadEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='ciudadEmpresa'/>
                        </Grid>


                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Departamento Empresa"
                                value={clienteContrato?.departamentoEmpresa==='' ? ' ':  clienteContrato.departamentoEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='departamentoEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Pais Empresa"
                                value={clienteContrato?.paisEmpresa==='' ? ' ':  clienteContrato.paisEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='paisEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Empresa"
                                value={clienteContrato?.telefonoEmpresa==='' ? ' ':  clienteContrato.telefonoEmpresa}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefonoEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Jefe Inmediato"
                                value={clienteContrato?.nombreJefeInmediato==='' ? ' ':  clienteContrato.nombreJefeInmediato}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombreJefeInmediato'/>
                        </Grid>

                    </Grid>

                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Contacto Emergencia"
                                value={clienteContrato?.nombreContactoEmerg==='' ? ' ':  clienteContrato.nombreContactoEmerg}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombreContactoEmerg'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Contacto 1"
                                value={clienteContrato?.telefono1ContactoEmerg==='' ? ' ':  clienteContrato.telefono1ContactoEmerg}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono1ContactoEmerg'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Contacto 2"
                                value={clienteContrato?.telefono2ContactoEmerg==='' ? ' ':  clienteContrato.telefono2ContactoEmerg}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono2ContactoEmerg'/>
                        </Grid>

                    </Grid>

                </Box>

            </div>

        </Box>
    );
}

export default ClienteContrato;