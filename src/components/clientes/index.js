import React, { useEffect, useState } from "react";
import { Box, Icon, IconButton, Toolbar, Tooltip, Typography, Pagination, List, Grid, TextField,
    Menu, MenuItem, ListItemText, Divider, InputBase,ListItem, ListItemButton, InputAdornment,
    FormControl, InputLabel, Select } from "@mui/material";
import { ModeSave, button } from "../../types/types";
import { useStateValue } from "../../context/store";
import useStyle from "../../themes/useStyle";
import ConfirmationDialogYesNo from "../utils/ConfirmationDialogYesNo";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './style.css';
import dayjs from "dayjs";
import { AddNewCliente, DeleteCliente, EditCliente, GetClientesFiltrados } from "../../actions/ClientesAction";
import { ShowErrorMessage, ShowSuccessMessage, ShowWarningMessage } from "../utils/messages";
import { GetSettinsgById } from "../../actions/ConfiguracionesAction";
import { clienteEmpty } from "../utils/Entities";

//     id: 0,
//     clienteId: '',
//     tipoDocumento: '',
//     numeroDocumento: '',
//     rtn: '',
//     tipoSujeto: '',
//     sexo: '',
//     nombres: '',
//     apellidos: '',
//     telefono1: '',
//     telefono2: '',
//     telefono3: '',
//     fax: '',
//     fechaNacimiento: null,
//     correoElectronico: '',
//     direccionCliente: '',
//     paisCliente: '',
//     departamentoCliente: '',
//     municipioCliente: '',
//     localidadCliente: '',
//     nacionalidadCliente: '',
//     nombreEmpresa: '',
//     direccionEmpresa: '',
//     localidadEmpresa: '',
//     ciudadEmpresa: '',
//     departamentoEmpresa: '',
//     paisEmpresa: '',
//     telefonoEmpresa: '',
//     nombreJefeInmediato: '',
//     nombreContactoEmerg: '',
//     telefono1ContactoEmerg: '',
//     telefono2ContactoEmerg: '',
// };

const Clientes = (props) => {

    const { setClienteContrato, mode, handleClose } = props;

    const [clientes,setClientes] = useState([]);
    const [cliente,setCliente] = useState(clienteEmpty);
    const [selectedCliente,setSelectedCliente] = useState(clienteEmpty);
    // const [modeSave,setModeSave] = useState(ModeSave.IsADDING);
    const [modeSave,setModeSave] = useState(mode);
    const [filterField,setFilterField] = useState('nofilter');
    const [filterValue,setFilterValue] = useState('');

    const [labelColor,setLabelColor] = useState('code_segment_blue');
    const [,dispatch] = useStateValue();
    const classes = useStyle();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);

    //Paginado
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [count, setCount] = useState(0);


    const [tipoSujetos,setTipoSujetos] = useState([]);
    const [sexos,setSexos] = useState([]);
    const [tipoDocumentos,setTipoDocumentos] = useState([]);

    useEffect(()=>{
        cargarInfoSelects();
    },[]);

    const cargarInfoSelects = async ()=>{
        setTipoSujetos(await cargarSettings('tsujeto'));
        setSexos(await cargarSettings('Sexo'));
        setTipoDocumentos(await cargarSettings('tipodocumento'));
    }

    async function cargarSettings(settingId, mod=''){
        let marcasTemp = [];
        var response = await GetSettinsgById(settingId, mod);
        var data = response?.data;
        if(data?.errorMessage === ''){
            let header = data.data;
            let details = header?.configuracionesDetalles;
            if(details.length > 0){
                details
                    .forEach(function(detail){marcasTemp
                    .push({item: detail.propiedad, value: detail.valor})});
            }
        }
        return marcasTemp;
    }

    const handleOnSave = async () => {
        if(modeSave === ModeSave.IsADDING){
            await callAddNewClientService();
        }
        else if(modeSave === ModeSave.IsEDITING){
            const responseEdit = await EditCliente(cliente);
            var dataEdit = responseEdit?.data;
            if(dataEdit.errorMessage === '')
            {
                handleOnCleanAll();
                setClientes(new Array(dataEdit.data));
                setLabelColor('code_segment_green');
                dispatch(ShowSuccessMessage('Plan editado satisfactoriamente'));
            }
            else
            {
                dispatch(ShowErrorMessage(dataEdit.errorMessage));
            }
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            const newClient = await callAddNewClientService();
            setClienteContrato(newClient);
            handleClose();
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            setClienteContrato(selectedCliente);
            handleClose();
        }
    }

    const callAddNewClientService = async () => {
        const responseSave = await AddNewCliente(cliente);
        var dataSave = responseSave?.data;
        if (dataSave.errorMessage === '') 
        {
            const tempCliente = dataSave.data;
            handleOnCleanAll();
            setClientes(new Array(dataSave.data));
            setLabelColor('code_segment_green');
            dispatch(ShowSuccessMessage('Nuevo Plan registrado satisfactoriamente'));
            return tempCliente;
        }
        else
        {
            dispatch(ShowErrorMessage(dataSave.errorMessage));
        }
        return clienteEmpty;
    }

    const handleDelete = () => {
        setOpenDialog(true);
    }

    const handleOnCleanAll = () => {
        setClientes([]);
        setCliente(clienteEmpty);
        setSelectedCliente(clienteEmpty);

        if(modeSave === ModeSave.IsEDITING)
            setModeSave(ModeSave.IsADDING);
        
        setFilterField('nofilter');
        setFilterValue('');
        setLabelColor('code_segment_blue');

        setPageIndex(1);
        setPageSize(10);
        setPageCount(0);
        setCount(0);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) handleOnSearch();
    }

    const handleOnSearch = () => {
        if (filterField === 'nofilter' || filterValue.trim() !== '' )
        {
            if(filterField === 'nofilter') setFilterValue('');
            setPageIndex(1);
            getClientesFiltered(1,pageSize,filterField,filterValue);
            setLabelColor('code_segment_blue');
        }
    }

    const getClientesFiltered = async (pIndex,pSize,fField,fValue) => {
        var response = await GetClientesFiltrados(pIndex,pSize,fField,fValue);
        var dataTemp = response?.data;
        if(dataTemp?.message === '')
        {
            setClientes(dataTemp.data);
            setCliente(clienteEmpty);
            
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);

            setPageIndex(dataTemp.pageIndex);
            setPageSize(dataTemp.pageSize);
            setPageCount(dataTemp.pageCount);
            setCount(dataTemp.count);
        }
    }

    const handleChangeFilterValue = (e) => {
        setFilterValue(e.target.value);
    }

    function IsSaveButtonEnabled(){
        if(modeSave === ModeSave.IsADDING){
            return !(cliente.clienteId.trim() !== '' &&
                cliente.nombres.trim() !== '' &&
                (cliente.fechaNacimiento && cliente.fechaNacimiento !== '') &&
                cliente.sexo.trim() !== '' &&
                cliente.tipoDocumento.trim() !== '' &&
                cliente.numeroDocumento.trim() !== '' &&
                cliente.tipoSujeto.trim() !== '' &&
                cliente.telefono1.trim() !== '');
        }
        else if(modeSave === ModeSave.IsEDITING){
            let sePuedeModificar = ( selectedCliente.id>0);
            let hayDiferencias = (selectedCliente.clienteId !== cliente.clienteId ||
                selectedCliente.nombres !== cliente.nombres ||
                selectedCliente.apellidos !== cliente.apellidos ||
                cliente.fechaNacimiento > selectedCliente.fechaNacimiento ||
                cliente.fechaNacimiento < selectedCliente.fechaNacimiento ||
                selectedCliente.sexo !== cliente.sexo ||
                selectedCliente.tipoDocumento !== cliente.tipoDocumento ||
                selectedCliente.numeroDocumento !== cliente.numeroDocumento ||
                selectedCliente.tipoSujeto !== cliente.tipoSujeto ||
                selectedCliente.rtn !== cliente.rtn ||
                selectedCliente.telefono1 !== cliente.telefono1 ||
                selectedCliente.telefono2 !== cliente.telefono2 ||
                selectedCliente.telefono3 !== cliente.telefono3 ||
                selectedCliente.fax !== cliente.fax ||
                selectedCliente.correoElectronico !== cliente.correoElectronico ||
                selectedCliente.nacionalidadCliente !== cliente.nacionalidadCliente ||
                selectedCliente.direccionCliente !== cliente.direccionCliente ||
                selectedCliente.paisCliente !== cliente.paisCliente ||
                selectedCliente.departamentoCliente !== cliente.departamentoCliente ||
                selectedCliente.municipioCliente !== cliente.municipioCliente ||
                selectedCliente.localidadCliente !== cliente.localidadCliente ||
                selectedCliente.nombreEmpresa !== cliente.nombreEmpresa ||
                selectedCliente.direccionEmpresa !== cliente.direccionEmpresa ||
                selectedCliente.localidadEmpresa !== cliente.localidadEmpresa ||
                selectedCliente.ciudadEmpresa !== cliente.ciudadEmpresa ||
                selectedCliente.departamentoEmpresa !== cliente.departamentoEmpresa ||
                selectedCliente.paisEmpresa !== cliente.paisEmpresa ||
                selectedCliente.telefonoEmpresa !== cliente.telefonoEmpresa ||
                selectedCliente.nombreJefeInmediato !== cliente.nombreJefeInmediato ||
                selectedCliente.nombreContactoEmerg !== cliente.nombreContactoEmerg ||
                selectedCliente.telefono1ContactoEmerg !== cliente.telefono1ContactoEmerg ||
                selectedCliente.telefono2ContactoEmerg !== cliente.telefono2ContactoEmerg);
            let camposLlenos = (cliente.clienteId.trim() !== '' &&
                cliente.nombres.trim() !== '' &&
                (cliente.fechaNacimiento && cliente.fechaNacimiento !== '') &&
                cliente.sexo.trim() !== '' &&
                cliente.tipoDocumento.trim() !== '' &&
                cliente.numeroDocumento.trim() !== '' &&
                cliente.tipoSujeto.trim() !== '' &&
                cliente.telefono1.trim() !== '');
            let desabilitar = (sePuedeModificar && hayDiferencias && camposLlenos);
            return !desabilitar;
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            return !(cliente.clienteId.trim() !== '' &&
                cliente.nombres.trim() !== '' &&
                (cliente.fechaNacimiento && cliente.fechaNacimiento !== '') &&
                cliente.sexo.trim() !== '' &&
                cliente.tipoDocumento.trim() !== '' &&
                cliente.numeroDocumento.trim() !== '' &&
                cliente.tipoSujeto.trim() !== '' &&
                cliente.telefono1.trim() !== '');
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            return (selectedCliente?.id===0 || selectedCliente?.id===-1);
        }
        return true;
    }

    function IsDeleteButtonEnabled(){
        return (selectedCliente?.id===0 || selectedCliente?.id===-1);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleCickMenu = (filter) => {
        setFilterField(filter);
        handleCloseMenu();
    }

    const handleCloseConfirmationDialog = async (newValue) => {
        setOpenDialog(false);
        
        if(newValue && newValue===button.SI)
        {   
            const response = await DeleteCliente(selectedCliente?.id);
            var data = response.data;
            if (data.errorMessage === '') 
            {
                let temp = selectedCliente;
                temp.id=-1;
                dispatch(ShowSuccessMessage(`Usted ha borrado el Cliente con ID: ${temp.clienteId}`));
                handleOnCleanAll();
                setClientes(new Array(temp));
                setLabelColor('code_segment_red');
            }
            else{
                dispatch(ShowWarningMessage(data.errorMessage));
            }
        }
    }

    const handleSelectItem = (item) => {
        if(item.id === cliente.id)
        {
            setCliente(clienteEmpty);
            setSelectedCliente(clienteEmpty);
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);
        }
        else
        {
            setCliente(item);
            // setCliente(prev =>({
            //     ...prev,
            //     fechaNacimiento:dayjs(item.fechaNacimiento)
            // }));

            setSelectedCliente(item);
            // setSelectedCliente(prev =>({
            //     ...prev,
            //     fechaNacimiento:dayjs(item.fechaNacimiento)
            // }));

            if(modeSave === ModeSave.IsEDITING || modeSave === ModeSave.IsADDING)
                setModeSave(ModeSave.IsEDITING);
        }
    }

    const handlePageChange = (event, value) => {
        setPageIndex(value);
        setCliente(clienteEmpty);
        getClientesFiltered(value,pageSize,filterField,filterValue);
        
        if(modeSave === ModeSave.IsEDITING)
            setModeSave(ModeSave.IsADDING);
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setCliente(prev =>({
            ...prev,
            [name]:value
        }));
    }

    function isDeleteVisible(){
        return (modeSave===ModeSave.IsADDING || modeSave===ModeSave.IsEDITING) 
            ? 'visible' : 'hidden';
    }


    return(
        <Box>
            <Toolbar variant="dense" className="page_toolbar">
                <div style={{display:'flex',flexGrow:1}}>
                    <Tooltip title="Aplicar" arrow enterDelay={1000}>
                        <IconButton disabled={IsSaveButtonEnabled()} size="small" edge="start" className="toolbar_button" onClick={handleOnSave}>
                            {(modeSave===ModeSave.IsADDING && <Icon fontSize='medium'>save</Icon>) ||
                             (modeSave===ModeSave.IsEDITING && <Icon fontSize='medium'>save_as</Icon>) ||
                             (modeSave===ModeSave.IsAddingForNew && <Icon fontSize='medium'>add</Icon>) ||
                             (modeSave===ModeSave.IsAddingForSelect && <Icon fontSize='medium'>task_alt</Icon>)}
                                
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Limpiar todo" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" className="toolbar_button" onClick={handleOnCleanAll}>
                            <Icon fontSize='medium'className="material-symbols-outlined">ink_eraser</Icon>
                        </IconButton>
                    </Tooltip>
                    <div className="separator"></div>
                    <Tooltip title="Borrar" arrow enterDelay={1000}>
                        <IconButton disabled={IsDeleteButtonEnabled()} sx={{visibility:isDeleteVisible}} 
                            size="small" color="inherit" className="toolbar_button" onClick={handleDelete}>
                                <Icon fontSize='medium'>delete</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{flexGrow: 1}}>
                    <Typography variant="h6" style={{color:'#0f80aa'}}>Clientes</Typography>
                </div>
                <div style={{flexGrow: 1}}/>
            </Toolbar>

            <ConfirmationDialogYesNo id="sino"
                keepMounted
                open={openDialog}
                onClose={handleCloseConfirmationDialog}
                title="Esta seguro?"
                content="Desea realmente eliminar este registro?"/>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{'aria-labelledby': 'basic-button'}}>
                    <MenuItem selected={filterField === 'nofilter'} onClick={()=>handleCickMenu('nofilter')}>
                        <ListItemText><em>Sin filtro</em></ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'nofilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <Divider/>
                    <MenuItem selected={filterField === 'nombrefilter'} onClick={()=>handleCickMenu('nombrefilter')}>
                        <ListItemText>Nombre</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'nombrefilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'descripcionfilter'} onClick={()=>handleCickMenu('descripcionfilter')}>
                        <ListItemText>Descripcion</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'descripcionfilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
            </Menu>

            <Box className='container_area_clientes'>

                 {(
                    modeSave !== ModeSave.IsAddingForNew &&
                    <div className="filter_area">
                        <div className="search">
                            <div className="search_by">
                                <IconButton sx={{ p: '1px' }} aria-label="menu" onClick={handleClick}
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}>
                                    <Icon fontSize='medium'>filter_alt</Icon>
                                </IconButton>
                                <InputBase name="filterValue"
                                    sx={{marginLeft:'5px',fontSize:'14px'}} 
                                    type="search"
                                    placeholder={'Filtrar por...'}
                                    value={filterValue}
                                    onKeyDown={handleKeyDown}
                                    onChange={handleChangeFilterValue}/>
                                <IconButton sx={{ p: '5px' }} aria-label="search" onClick={handleOnSearch}>
                                    <Icon fontSize='medium' sx={{height:'30px',width:'30px'}}>search</Icon>
                                </IconButton>
                            </div>
                        </div>
                        <div className="paged_list">
                            <Divider/>
                                <List className={classes.list}>
                                    {clientes.length > 0 ?
                                    clientes.map((value) => {
                                        return (
                                            <ListItem disablePadding>
                                                
                                                <ListItemButton
                                                    classes={{root:classes.item_selected_root, selected:classes.item_selected}}
                                                    selected={ cliente?.id === value.id}
                                                    onClick={()=>handleSelectItem(value)}>
                                                        <div className="paged_card">
                                                            <div className={labelColor+'_left'}>
                                                                Cliente Id
                                                            </div>
                                                            <div className={labelColor + "_right"}>
                                                                {value.clienteId}
                                                            </div>
                                                            <div className="description_segment">
                                                                <strong>Nombres:&nbsp;</strong>{value.nombres}
                                                            </div>
                                                            <div className="name_segment">
                                                            <strong>Apellidos:&nbsp;</strong>{value.apellidos}
                                                            </div>
                                                        </div>
                                                </ListItemButton>

                                            </ListItem>
                                        );
                                    })
                                    : <div style={{textAlign:'center',fontWeight:'bold'}}>No hay datos</div>}
                                </List>
                            <Divider/>
                            <div className="pagination">
                                <div style={{width:'max-content',margin:'2px auto'}}>
                                    <Pagination
                                        size="small" 
                                        count={pageCount} 
                                        siblingCount={0} 
                                        boundaryCount={1} 
                                        page={pageIndex} 
                                        onChange={handlePageChange}/>
                                </div>
                                <div style={{width:'max-content',margin:'auto',fontSize:'12px',marginTop:'2px',visibility :count>0 ? 'visible':'hidden'}}>
                                    Item por pagina: <strong>{pageSize}</strong>, Total: <strong>{count}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="body">

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Id Cliente"
                                required
                                autoComplete={false}
                                value={cliente.clienteId ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='clienteId'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="tiposujeto-label">Tipo Sujeto *</InputLabel>
                                <Select labelId="tiposujeto-label"
                                    required
                                    value={cliente.tipoSujeto ?? ''}
                                    label="Tipo Sujeto"
                                    name="tipoSujeto"
                                    inputProps={{
                                        readOnly: modeSave === ModeSave.IsAddingForSelect,
                                    }}
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {tipoSujetos.map((tipoSujeto) => (
                                            <MenuItem key={tipoSujeto.item} value={tipoSujeto.value}>
                                                {tipoSujeto.item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    
                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                            <TextField label="Nombres"
                                required
                                autoComplete={false}
                                value={cliente.nombres ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='nombres'/>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                            <TextField label="Apellidos"
                                required
                                autoComplete={false}
                                value={cliente.apellidos ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='apellidos'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Fecha Nacimiento"
                                    name='fechaNacimiento'
                                    readOnly={ modeSave === ModeSave.IsAddingForSelect }
                                    // value={cliente.fechaNacimiento}
                                    value={cliente.fechaNacimiento!==null ? dayjs(cliente.fechaNacimiento) : null}
                                    className={classes.gridmbtop}
                                    onChange={(newValue) => setCliente(prev =>({...prev,fechaNacimiento:newValue}))}
                                    slotProps={{ textField: { size: 'small',required:true, fullWidth:true } } }
                                    inputProps={{readOnly: true}}
                                    renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="sexo-label">Sexo *</InputLabel>
                                <Select labelId="sexo-label"
                                    required
                                    value={cliente.sexo ?? ''}
                                    label="Sexo"
                                    name="sexo"
                                    inputProps={{
                                        readOnly: modeSave === ModeSave.IsAddingForSelect,
                                    }}
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {sexos.map((sexo) => (
                                            <MenuItem key={sexo.item} value={sexo.value}>
                                                {sexo.item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="tipodocumento-label">Tipo Documento *</InputLabel>
                                <Select labelId="tipodocumento-label"
                                    required
                                    value={cliente.tipoDocumento ?? ''}
                                    label="Tipo Documento"
                                    name="tipoDocumento"
                                    inputProps={{
                                        readOnly: modeSave === ModeSave.IsAddingForSelect,
                                    }}
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {tipoDocumentos.map((tipoDocumento) => (
                                            <MenuItem key={tipoDocumento.item} value={tipoDocumento.value}>
                                                {tipoDocumento.item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Numero documento"
                                required
                                autoComplete={false}
                                value={cliente.numeroDocumento ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='numeroDocumento'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="RTN"
                                autoComplete={false}
                                value={cliente.rtn ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='rtn'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={8} lg={3} xl={3}>
                            <TextField label="Correo Electronico"
                                autoComplete={false}
                                value={cliente.correoElectronico ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='correoElectronico'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 1"
                                required
                                autoComplete={false}
                                value={cliente.telefono1 ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefono1'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 2"
                                autoComplete={false}
                                value={cliente.telefono2 ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefono2'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono 3"
                                autoComplete={false}
                                value={cliente.telefono3 ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefono3'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Fax"
                                autoComplete={false}
                                value={cliente.fax ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='fax'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nacionalidad Cliente"
                                autoComplete={false}
                                value={cliente.nacionalidadCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='nacionalidadCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={9} xl={9}>
                            <TextField label="Direccion Cliente"
                                autoComplete={false}
                                value={cliente.direccionCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='direccionCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Pais Cliente"
                                autoComplete={false}
                                value={cliente.paisCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='paisCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Departamento Cliente"
                                autoComplete={false}
                                value={cliente.departamentoCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='departamentoCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Municipio Cliente"
                                autoComplete={false}
                                value={cliente.municipioCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='municipioCliente'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Localidad Cliente"
                                autoComplete={false}
                                value={cliente.localidadCliente ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='localidadCliente'/>
                        </Grid>

                    </Grid>
                    
                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Empresa"
                                autoComplete={false}
                                value={cliente.nombreEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='nombreEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Direccion Empresa"
                                autoComplete={false}
                                value={cliente.direccionEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='direccionEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Localidad Empresa"
                                autoComplete={false}
                                value={cliente.localidadEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='localidadEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Ciudad Empresa"
                                autoComplete={false}
                                value={cliente.ciudadEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='ciudadEmpresa'/>
                        </Grid>


                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Departamento Empresa"
                                autoComplete={false}
                                value={cliente.departamentoEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='departamentoEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Pais Empresa"
                                autoComplete={false}
                                value={cliente.paisEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='paisEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Empresa"
                                autoComplete={false}
                                value={cliente.telefonoEmpresa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefonoEmpresa'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Jefe Inmediato"
                                autoComplete={false}
                                value={cliente.nombreJefeInmediato ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='nombreJefeInmediato'/>
                        </Grid>

                    </Grid>
                    
                    <Divider sx={{marginTop:'15px',marginBottom:'20px',backgroundColor:'darkgray',height:'3px'}}/>

                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Nombre Contacto Emergencia"
                                autoComplete={false}
                                value={cliente.nombreContactoEmerg ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='nombreContactoEmerg'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Contacto 1"
                                autoComplete={false}
                                value={cliente.telefono1ContactoEmerg ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefono1ContactoEmerg'/>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                            <TextField label="Telefono Contacto 2"
                                autoComplete={false}
                                value={cliente.telefono2ContactoEmerg ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='telefono2ContactoEmerg'/>
                        </Grid>

                    </Grid>

                </div>
            </Box>
        </Box>
    );
}

export default Clientes;