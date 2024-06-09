import React, { useState } from "react";
import './style.css';
import { Box, Button, Divider, Grid, Icon, TextField, Tooltip } from "@mui/material";
import useStyle from "../../../themes/useStyle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";


const Resumen = (props) => {
    const { cliente, plan, vehiculos
        ,fechaDesde, fechaHasta, setFechaDesde, setFechaHasta
        ,GoToPrevStep, GoToPdf } = props;

    const [mesesContrato, setMesesContrato ] = useState('0 mes(es)');

    const classes = useStyle();

    const onChangeFechaDesde = (value) => {
        if(value > fechaHasta){
            setFechaHasta(value);    
        }
        let dias = dayjs(fechaHasta).diff(value,'months');
        setMesesContrato(dias + ' mes(es)');
        setFechaDesde(value);
    }

    const onChangeFechaHasta = (value) => {
        if(value < fechaDesde){
            setFechaDesde(value);
        }
        let dias = dayjs(value).add(1,'days').diff(fechaDesde,'months');
        setMesesContrato(dias + ' mes(es)');
        setFechaHasta(value);
    }

    return(
        <Box>

            <div className="body_resumen_contrato">

                <Box className='navigation_bar'>
                    <Tooltip title="Paso previo" arrow enterDelay={1000}>
                        <Button className="boton_id_prev" onClick={GoToPrevStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_before</Icon>
                        </Button>
                    </Tooltip>
                    <Box sx={{ flex: '1 1 auto'}}>
                        <div className="title">Resumen</div>
                    </Box>
                    {/* <Tooltip title="Paso siguiente" arrow enterDelay={1000}>
                        <Button disabled className="boton_id_next" >
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_next</Icon>
                        </Button>
                    </Tooltip> */}
                    <Tooltip title="Ver en PDF" arrow enterDelay={1000}>
                        <Button className="boton_id_next" disabled={false} onClick={GoToPdf}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='medium'>picture_as_pdf</Icon>
                        </Button>
                    </Tooltip>
                </Box>

                <Divider/>

                <Box className='info_area'>
                    
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <div className="title">Datos del cliente</div>
                        </Grid>
                    </Grid>

                    {/* CLIENTE */}
                    <Grid container spacing={0} className="grid">

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Nombre"
                                value={cliente.nombres + ' ' + cliente.apellidos}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombres_apellidos'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Numero de indentidad"
                                value={cliente.numeroDocumento ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='numeroDocumento'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Direccion personal"
                                value={cliente.direccionCliente ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='direccionCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Ciudad"
                                value={cliente.municipioCliente ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='municipioCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Numero de telefono"
                                value={cliente.telefono1 ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono1'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Departamento"
                                value={cliente.departamentoCliente ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='departamentoCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Correo electronico"
                                value={cliente.correoElectronico ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='correoElectronico'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Numero de emergencia"
                                value={cliente.telefono1ContactoEmerg ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='telefono1ContactoEmerg'/>
                        </Grid>

                    </Grid>

                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <div className="title">Servicios contratados</div>
                        </Grid>
                    </Grid>

                    {/* Plan */}
                    <Grid container spacing={0} className="grid">

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Fecha del contrato"
                                    name='fechaDesde'
                                    variant="filled"
                                    value={dayjs(fechaDesde)}
                                    className={classes.gridmbtop}
                                    onChange={(newValue)=>onChangeFechaDesde(newValue)}
                                    slotProps={{ textField: { variant:"filled", size: 'small',required:true, fullWidth:true } } }
                                    inputProps={{readOnly: true}}
                                    renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Duracion del contrato"
                                value={mesesContrato}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                // InputProps={{readOnly: true}}
                                name='duracionContrato'
                                />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Fecha de vencimiento"
                                    name='fechaHasta'
                                    variant="filled"
                                    value={dayjs(fechaHasta)}
                                    className={classes.gridmbtop}
                                    onChange={(newValue)=>onChangeFechaHasta(newValue)}
                                    slotProps={{ textField: { variant:"filled", size: 'small',required:true, fullWidth:true } } }
                                    inputProps={{readOnly: true}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Plan del Cliente"
                                value={plan.nombre ?? ' '}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='nombre'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Precio del plan"
                                // value={plan.moneda + ' ' + plan.precio}
                                value={plan.moneda + ' ' + plan.precio?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='precio'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <TextField label="Numero de unidades"
                                value={vehiculos.length}
                                size="small"
                                variant="filled" 
                                fullWidth
                                className={classes.gridmbtop}
                                InputProps={{readOnly: true}}
                                name='cantidad_unidades'/>
                        </Grid>

                    </Grid>

                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <div className="title">Datos de la unidad(es)</div>
                        </Grid>
                    </Grid>

                    {/* Vehiculos header */}
                    <Grid container spacing={0} className="grid_column">
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="head_column_base">
                            Marca
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="head_column">
                            Modelo
                        </Grid>
                        <Grid item xs={2} sm={1} md={1} lg={1} xl={1} className="head_column">
                            Año
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="head_column">
                            Numero de placa
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="head_column">
                            Color
                        </Grid>
                        <Grid item xs={2} sm={3} md={3} lg={3} xl={3} className="head_column">
                            Financiado
                        </Grid>
                    </Grid>

                    {/* Vehiculos */}
                    {vehiculos.map((value,index) => {
                        return (
                            <Grid container spacing={0} className="grid_column">

                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="column_base">
                                    <TextField name='marca'
                                        value={value.marca ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="column">
                                    <TextField name='modelo'
                                        value={value.modelo ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={1} md={1} lg={1} xl={1} className="column">
                                    <TextField name='anio'
                                        value={value.anio ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="column">
                                    <TextField name='placa'
                                        value={value.placa ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2} className="column">
                                    <TextField name='color'
                                        value={value.color ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={3} md={3} lg={3} xl={3} className="column">
                                    <TextField name='financiadoPor'
                                        value={value.financiadoPor ?? ' '}
                                        size="small"
                                        variant="filled" 
                                        fullWidth
                                        className={classes.gridmbtop}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid>

                            </Grid>
                        )
                    })}
                    

                </Box>

            </div>

        </Box>
    );

}

export default Resumen;