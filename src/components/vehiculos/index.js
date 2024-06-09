import React, { useEffect, useState } from "react";
import { Box, Divider, FormControl, Grid, Icon, IconButton, InputBase, InputLabel, List, ListItem, ListItemButton,
    ListItemText, Menu, MenuItem, Pagination, Select, Switch, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { ShowErrorMessage, ShowSuccessMessage, ShowWarningMessage } from "../utils/messages";
import { GetVehiculosFiltrados, AddNewVehicle, EditVehicle, DeleteVehicle } from '../../actions/VehiculosAction';
import { useStateValue } from "../../context/store";
import { ModeSave, button } from "../../types/types";
import ConfirmationDialogYesNo from "../utils/ConfirmationDialogYesNo";
import { GetSettinsgById } from "../../actions/ConfiguracionesAction";
import useStyle from "../../themes/useStyle";
import { vehiculoEmpty } from "../utils/Entities";
import './style.css'


const Vehiculos = (props) => {
    const { setVehiculoContrato, mode, handleClose } = props;

    const [vehiculo,setVehiculo] = useState(vehiculoEmpty);
    const [selectedVehiculo,setSelectedVehiculo] = useState(vehiculoEmpty);
    const [vehiculos,setVehiculos] = useState([]);
    const [filterField,setFilterField] = useState('nofilter');
    const [filterValue,setFilterValue] = useState('');
    const [labelColor,setLabelColor] = useState('code_segment_blue');
    const [marcas,setMarcas] = useState([]);
    const [modelos,setModelos] = useState([]);
    // const [modeSave,setModeSave] = useState(ModeSave.IsADDING);
    const [modeSave,setModeSave] = useState(mode);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);

    //Paginado
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [count, setCount] = useState(0);

    const [,dispatch] = useStateValue();
    const classes = useStyle();

    useEffect(()=>{
        cargarDatosMarcas();
    },[]);

    const cargarDatosMarcas = async ()=>{
        // setMarcas(await cargarSettings('vehiculos'));
        setMarcas(await cargarSettings('vehiculos_marcas'));
    }

    const cargarDatosModelos = async (mod)=>{
        setModelos(await cargarSettings('vehiculos_modelos', mod));
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
                    .push({item: detail.valor, value: detail.valor})});
            }
        }
        return marcasTemp;
    }

    const getVehiculsFiltered = async (pIndex,pSize,fField,fValue) => {
        var response = await GetVehiculosFiltrados(pIndex,pSize,fField,fValue);
        var dataTemp = response?.data;
        if(dataTemp?.message === '')
        {
            setVehiculos(dataTemp.data);
            setVehiculo(vehiculoEmpty);

            // setModeSave(ModeSave.IsADDING);
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);

            setPageIndex(dataTemp.pageIndex);
            setPageSize(dataTemp.pageSize);
            setPageCount(dataTemp.pageCount);
            setCount(dataTemp.count);
        }
    }

    const handlePageChange = (event, value) => {
        setPageIndex(value);
        setVehiculo(vehiculoEmpty);
        getVehiculsFiltered(value,pageSize,filterField,filterValue);

        // setModeSave(ModeSave.IsADDING);
        if(modeSave === ModeSave.IsEDITING)
            setModeSave(ModeSave.IsADDING);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCickMenu = (filter) => {
        setFilterField(filter);
        handleCloseMenu();
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleSelectItem = (item) => {
        if(item.vehiculoId === vehiculo.vehiculoId)
        {
            setVehiculo(vehiculoEmpty);
            setSelectedVehiculo(vehiculoEmpty);
            setModelos([]);
            // setModeSave(ModeSave.IsADDING);
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);
        }
        else
        {
            setVehiculo(item);
            setSelectedVehiculo(item);
            cargarDatosModelos(item.marca);

            // setModeSave(ModeSave.IsEDITING);
            if(modeSave === ModeSave.IsEDITING || modeSave === ModeSave.IsADDING)
                setModeSave(ModeSave.IsEDITING);
        }
    }

    const handleOnSave = async () => {
        if(modeSave === ModeSave.IsADDING){
            await callAddNewvehiculoService();
        }
        else if(modeSave === ModeSave.IsEDITING){
            const responseEdit = await EditVehicle(vehiculo);
            var dataEdit = responseEdit?.data;
            if(dataEdit.errorMessage === '')
            {
                handleOnCleanAll();
                setVehiculos(new Array(dataEdit.data));
                setLabelColor('code_segment_green');
                dispatch(ShowSuccessMessage('Vehiculo editado satisfactoriamente'));
            }
            else
            {
                dispatch(ShowErrorMessage(dataEdit.errorMessage));
            }
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            const newVehicle = await callAddNewvehiculoService();
            setVehiculoContrato(newVehicle);
            handleClose();
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            setVehiculoContrato(selectedVehiculo);
            handleClose();
        }
        
    }

    const callAddNewvehiculoService = async () => {
        const responseSave = await AddNewVehicle(vehiculo);
        var dataSave = responseSave?.data;
        if (dataSave.errorMessage === '') 
        {
            const tempVehicle = dataSave.data;
            handleOnCleanAll();
            setVehiculos(new Array(dataSave.data));
            setLabelColor('code_segment_green');
            dispatch(ShowSuccessMessage('Nuevo vehiculo registrado satisfactoriamente'));
            return tempVehicle;
        }
        else
        {
            dispatch(ShowErrorMessage(dataSave.errorMessage));
        }
        return vehiculoEmpty;
    }

    const handleOnCleanAll = () => {
        setVehiculos([]);
        setVehiculo(vehiculoEmpty);
        setSelectedVehiculo(vehiculoEmpty);
        setModelos([]);
        
        // setModeSave(ModeSave.IsADDING);
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

    const handleChange = (e) => {
        const {name,value} = e.target;
        if(name === 'marca'){
            setVehiculo(prev =>({
                ...prev,
                modelo:'',
                [name]:value
            }));
            cargarDatosModelos(value);
        }
        else
        {
            setVehiculo(prev =>({
                ...prev,
                [name]:value
            }));
        }
    }

    const handleChangeSwitch = (e) => {
        const {name,checked} = e.target;
        setVehiculo(prev =>({
            ...prev,
            [name]:checked,
            financiadoPor:!checked ? '':selectedVehiculo.financiadoPor
        }));
    }

    const handleChangeFilterValue = (e) => {
        setFilterValue(e.target.value);
    }

    const handleOnSearch = () => {
        if (filterField === 'nofilter' || filterValue.trim() !== '' )
        {
            if(filterField === 'nofilter') setFilterValue('');
            setPageIndex(1);
            getVehiculsFiltered(1,pageSize,filterField,filterValue);
            setLabelColor('code_segment_blue');
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) handleOnSearch();
    }

    function IsSaveButtonEnabled(){

        if(modeSave === ModeSave.IsADDING){
            return !((vehiculo.placa.trim() !== '' &&
                vehiculo.marca.trim() !== '' &&
                vehiculo.modelo.trim() !== '' &&
                vehiculo.anio > 0 &&
                vehiculo.color.trim() !== '') && 
                ((vehiculo.esFinanciado === false) ||
                 (vehiculo.esFinanciado === true && 
                  vehiculo.financiadoPor.trim() !== '')));
        }
        else if(modeSave === ModeSave.IsEDITING){
            let sePuedeModificar = ( selectedVehiculo.vehiculoId>0);
            let hayDiferencias = (
                        selectedVehiculo.placa !== vehiculo.placa ||
                        selectedVehiculo.marca !== vehiculo.marca ||
                        selectedVehiculo.modelo !== vehiculo.modelo ||
                        selectedVehiculo.anio !== Number(vehiculo.anio) ||
                        selectedVehiculo.color !== vehiculo.color ||
                        selectedVehiculo.numeroVin !== vehiculo.numeroVin ||
                        selectedVehiculo.chasis !== vehiculo.chasis ||
                        selectedVehiculo.esFinanciado !== vehiculo.esFinanciado ||
                        selectedVehiculo.financiadoPor !== vehiculo.financiadoPor);
            let camposLlenos = (
                       (vehiculo.placa.trim() !== '' &&
                        vehiculo.marca.trim() !== '' &&
                        vehiculo.modelo.trim() !== '' &&
                        vehiculo.anio > 0 &&
                        vehiculo.color.trim() !== '') && 
                        ((vehiculo.esFinanciado === false) ||
                         (vehiculo.esFinanciado === true && 
                          vehiculo.financiadoPor.trim() !== '')));

            let desabilitar = (sePuedeModificar && hayDiferencias && camposLlenos);
            return !desabilitar;
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            return !((vehiculo.placa.trim() !== '' &&
                    vehiculo.marca.trim() !== '' &&
                    vehiculo.modelo.trim() !== '' &&
                    vehiculo.anio > 0 &&
                    vehiculo.color.trim() !== '') && 
                    ((vehiculo.esFinanciado === false) ||
                    (vehiculo.esFinanciado === true && 
                    vehiculo.financiadoPor.trim() !== '')));
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            return (selectedVehiculo?.id===0 || selectedVehiculo?.id===-1);
        }
        return false;
    }

    function IsDeleteButtonEnabled(){
        return (selectedVehiculo?.vehiculoId===0 || selectedVehiculo?.vehiculoId===-1);
    }

    const handleDelete = () => {
        setOpenDialog(true);
    }

    const handleCloseConfirmationDialog = async (newValue) => {
        setOpenDialog(false);
        
        if(newValue && newValue===button.SI)
        {
            dispatch(ShowSuccessMessage(`Usted ha borrado el registro:`));
            
            const response = await DeleteVehicle(selectedVehiculo?.vehiculoId);
            var data = response.data;
            if (data.errorMessage === '') 
            {
                let temp = selectedVehiculo;
                temp.vehiculoId=-1;
                dispatch(ShowSuccessMessage(`Usted ha borrado el vehiculo con placa: ${temp.placa}`));
                handleOnCleanAll();
                setVehiculos(new Array(temp));
                setLabelColor('code_segment_red');
            }
            else{
                dispatch(ShowWarningMessage(data.errorMessage));
            }
        }
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
                    <Typography variant="h6" style={{color:'#0f80aa'}}>Vehiculos</Typography>
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
                        <ListItemText style={{width:'70px'}}><em>Sin filtro</em></ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'nofilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <Divider/>
                    <MenuItem selected={filterField === 'placafilter'} onClick={()=>handleCickMenu('placafilter')}>
                        <ListItemText style={{width:'70px'}}>Placa</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'placafilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'marcafilter'} onClick={()=>handleCickMenu('marcafilter')}>
                        <ListItemText style={{width:'70px'}}>Marca</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'marcafilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'modelofilter'} onClick={()=>handleCickMenu('modelofilter')}>
                        <ListItemText style={{width:'70px'}}>Modelo</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'modelofilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'aniofilter'} onClick={()=>handleCickMenu('aniofilter')}>
                        <ListItemText style={{width:'70px'}}>Año</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'aniofilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
            </Menu>

            <Box className='container_area_vehiculos'>

                {(modeSave !== ModeSave.IsAddingForNew &&
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

                            {vehiculos.length > 0 ?
                            vehiculos.map((value) => {
                                return (
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        classes={{root:classes.item_selected_root, selected:classes.item_selected}}
                                        selected={ vehiculo?.vehiculoId === value.vehiculoId}
                                        onClick={()=>handleSelectItem(value)}
                                    >
                                        <div className="paged_card">
                                            <div className={labelColor+'_left'}>
                                                Placa
                                            </div>
                                            <div className={labelColor + "_right"}>
                                                {value.placa}
                                            </div>
                                            <div className="name_segment">
                                                <strong>Marca:&nbsp;</strong>{value.marca}
                                            </div>
                                            <div className="description_segment">
                                            <strong>Modelo:&nbsp;</strong>{value.modelo}&nbsp;({value.anio})
                                            </div>
                                            <div className="description_segment">
                                            <strong>Color:&nbsp;</strong>{value.color}
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

                    <Grid container spacing={2} sx={{width:'60%',height:'60%'}}>
                        <Grid item xs={12} md={6}>
                            <TextField label="Placa"
                                required
                                value={vehiculo.placa ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='placa'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* <>{modeSave} ENABLED: {!IsSaveButtonEnabled()?'TRUE':'FALSE'} VehiculoId: {selectedVehiculo?.vehiculoId} </> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="marca-label">Marca *</InputLabel>
                                <Select labelId="marca-label"
                                    required
                                    value={vehiculo.marca ?? ''}
                                    label="Marca"
                                    name="marca"
                                    inputProps={{
                                        readOnly: modeSave === ModeSave.IsAddingForSelect,
                                    }}
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {marcas.map((marca) => (
                                            <MenuItem key={marca.item} value={marca.value}>
                                                {marca.item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="modelo-label">Modelo *</InputLabel>
                                <Select labelId="modelo-label"
                                    required
                                    value={vehiculo.modelo ?? ''}
                                    label="Modelo"
                                    name="modelo"
                                    inputProps={{
                                        readOnly: modeSave === ModeSave.IsAddingForSelect,
                                    }}
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {modelos.map((modelo) => (
                                            <MenuItem key={modelo.item} value={modelo.value}>
                                                {modelo.item}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Año"
                                required
                                value={vehiculo.anio ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='anio'
                                type="number"/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Color"
                                required
                                value={vehiculo.color ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='color'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="NumeroVin"
                                value={vehiculo.numeroVin ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='numeroVin'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Chasis"
                                value={vehiculo.chasis ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='chasis'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Es Financiado"
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <div style={{display:'flex',position:'relative',left:'calc(50% - 55px)'}}>
                                            <Typography sx={{margin:'auto'}}>No</Typography>
                                            <Switch
                                                sx={{margin:'0',padding:'10px 2px 10px 2px',width:'60px'}}
                                                labelId="demo-simple-select-label"
                                                name="esFinanciado"
                                                disabled={modeSave === ModeSave.IsAddingForSelect}
                                                value={vehiculo?.esFinanciado ?? false}
                                                checked={vehiculo?.esFinanciado ?? false}
                                                onChange={handleChangeSwitch}/>
                                            <Typography sx={{margin:'auto'}}>Si</Typography>
                                        </div>
                                    )
                                }}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Financiado Por"
                                disabled={!(vehiculo?.esFinanciado ?? false)}
                                required={(vehiculo?.esFinanciado ?? false)}
                                value={vehiculo.financiadoPor ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth 
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: modeSave === ModeSave.IsAddingForSelect,
                                }}
                                name='financiadoPor'/>
                        </Grid>
                    </Grid>

                </div>
            </Box>
        </Box>
    );
}

export default Vehiculos;