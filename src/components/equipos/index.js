import React, { useEffect, useState } from "react";
import { Box, Divider, FormControl, Grid, Icon, IconButton, InputBase, InputLabel, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Pagination, Select, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { ModeSave, button } from "../../types/types";
import useStyle from "../../themes/useStyle";
import './style.css';
import { AddNewEquipo, DeleteEquipo, EditEquipo, GetEquiposFiltrados } from "../../actions/EquiposAction";
import ConfirmationDialogYesNo from "../utils/ConfirmationDialogYesNo";
import { ShowErrorMessage, ShowSuccessMessage, ShowWarningMessage } from "../utils/messages";
import { useStateValue } from "../../context/store";
import { GetSettinsgById } from "../../actions/ConfiguracionesAction";
import { equipoEmpty } from "../utils/Entities";
import { SaveArrowDown } from "../utils/customIcons";


const Equipos = (props) => {
    const { setEquipoContrato, mode, handleClose } = props;

    const [equipos,setEquipos] = useState([]);
    const [equipo,setEquipo] = useState(equipoEmpty);
    const [selectedEquipo,setSelectedEquipo] = useState(equipoEmpty);
    // const [modeSave,setModeSave] = useState(ModeSave.IsADDING);
    const [modeSave,setModeSave] = useState(mode);
    const [filterField,setFilterField] = useState('nofilter');
    const [filterValue,setFilterValue] = useState('');
    const [labelColor,setLabelColor] = useState('code_segment_blue');
    const [marcas,setMarcas] = useState([]);
    const [modelos,setModelos] = useState([]);
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

//======================================================================================================================================

    useEffect(()=>{
        cargarDatosMarcas();
    },[]);

    const cargarDatosMarcas = async ()=>{
        setMarcas(await cargarSettings('equipos_marcas'));
    }

    const cargarDatosModelos = async (mod)=>{
        setModelos(await cargarSettings('equipos_modelos',mod));
    }

    async function cargarSettings(settingId, mod=''){
        let marcasTemp = [];
        var response = await GetSettinsgById(settingId,mod);
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

    const getEquiposFiltered = async (pIndex,pSize,fField,fValue) => {
        var response = await GetEquiposFiltrados(pIndex,pSize,fField,fValue);
        var dataTemp = response?.data;
        if(dataTemp?.message === '')
        {
            setEquipos(dataTemp.data);
            setEquipo(equipoEmpty);

            // setModeSave(ModeSave.IsADDING);
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);

            setPageIndex(dataTemp.pageIndex);
            setPageSize(dataTemp.pageSize);
            setPageCount(dataTemp.pageCount);
            setCount(dataTemp.count);
        }
    }

    function IsSaveButtonEnabled(){
        if(modeSave === ModeSave.IsADDING){
            return !(equipo.marca.trim() !== '' &&
                equipo.modelo.trim() !== '' &&
                equipo.numeroIMEI.trim() !== '');
        }
        else if(modeSave === ModeSave.IsEDITING){
            let sePuedeModificar = ( selectedEquipo.equipoId>0);
            let hayDiferencias = (selectedEquipo.marca !== equipo.marca ||
                        selectedEquipo.modelo !== equipo.modelo ||
                        selectedEquipo.numeroIMEI !== equipo.numeroIMEI ||
                        selectedEquipo.numeroSindCard !== equipo.numeroSindCard);
            let camposLlenos = (equipo.marca.trim() !== '' &&
                        equipo.modelo.trim() !== '' &&
                        equipo.numeroIMEI.trim() !== '');
            let desabilitar = (sePuedeModificar && hayDiferencias && camposLlenos);
            return !desabilitar;
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            return !(equipo.marca.trim() !== '' &&
                equipo.modelo.trim() !== '' &&
                equipo.numeroIMEI.trim() !== '');
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            return (selectedEquipo?.equipoId===0 || selectedEquipo?.equipoId===-1);
        }

        return false;
    }

    function IsDeleteButtonEnabled(){
        return (selectedEquipo?.equipoId===0 || selectedEquipo?.equipoId===-1);
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        if(name === 'marca'){
            setEquipo(prev =>({
                ...prev,
                modelo:'',
                [name]:value
            }));
            debugger
            cargarDatosModelos(value);
        }
        else
        {
            setEquipo(prev =>({
                ...prev,
                [name]:value
            }));
        }
    }

    const handleOnSave = async () => {
        if(modeSave === ModeSave.IsADDING){
            await callAddNewEquipoService();
        }
        else if(modeSave === ModeSave.IsEDITING){
            const responseEdit = await EditEquipo(equipo);
            var dataEdit = responseEdit?.data;
            if(dataEdit.errorMessage === '')
            {
                handleOnCleanAll();
                setEquipos(new Array(dataEdit.data));
                setLabelColor('code_segment_green');
                dispatch(ShowSuccessMessage('Equipo editado satisfactoriamente'));
            }
            else
            {
                dispatch(ShowErrorMessage(dataEdit.errorMessage));
            }
        }
        else if(modeSave === ModeSave.IsAddingForNew){
            const newEquipo = await callAddNewEquipoService();
            setEquipoContrato(newEquipo);
            handleClose();
        }
        else if(modeSave === ModeSave.IsAddingForSelect){
            setEquipoContrato(selectedEquipo);
            handleClose();
        }
    }

    const callAddNewEquipoService = async () => {
        const responseSave = await AddNewEquipo(equipo);
        var dataSave = responseSave?.data;
        if (dataSave.errorMessage === '') 
        {
            const tempEquipo = dataSave.data;
            handleOnCleanAll();
            setEquipos(new Array(dataSave.data));
            setLabelColor('code_segment_green');
            dispatch(ShowSuccessMessage('Nuevo Equipo registrado satisfactoriamente'));
            return tempEquipo;
        }
        else
        {
            dispatch(ShowErrorMessage(dataSave.errorMessage));
        }
        return equipoEmpty;
    }

    const handleDelete = () => {
        setOpenDialog(true);
    }

    const handleOnCleanAll = () => {
        setEquipos([]);
        setEquipo(equipoEmpty);
        setSelectedEquipo(equipoEmpty);
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

    const handlePageChange = (event, value) => {
        setPageIndex(value);
        setEquipo(equipoEmpty);
        getEquiposFiltered(value,pageSize,filterField,filterValue);

        if(modeSave === ModeSave.IsEDITING)
            setModeSave(ModeSave.IsADDING);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) handleOnSearch();
    }

    const handleChangeFilterValue = (e) => {
        setFilterValue(e.target.value);
    }

    const handleOnSearch = () => {
        if (filterField === 'nofilter' || filterValue.trim() !== '' )
        {
            if(filterField === 'nofilter') setFilterValue('');
            setPageIndex(1);
            getEquiposFiltered(1,pageSize,filterField,filterValue);
            setLabelColor('code_segment_blue');
        }
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleCickMenu = (filter) => {
        setFilterField(filter);
        handleCloseMenu();
    }

    const handleSelectItem = (item) => {
        if(item.equipoId === equipo.equipoId)
        {
            setEquipo(equipoEmpty);
            setSelectedEquipo(equipoEmpty);
            setModelos([]);
            // setModeSave(ModeSave.IsADDING);
            if(modeSave === ModeSave.IsEDITING)
                setModeSave(ModeSave.IsADDING);
        }
        else
        {
            setEquipo(item);
            setSelectedEquipo(item);
            cargarDatosModelos(item.marca);
            // setModeSave(ModeSave.IsEDITING);
            if(modeSave === ModeSave.IsEDITING || modeSave === ModeSave.IsADDING)
                setModeSave(ModeSave.IsEDITING);
        }
    }

    const handleCloseConfirmationDialog = async (newValue) => {
        setOpenDialog(false);
        
        if(newValue && newValue===button.SI)
        {
            dispatch(ShowSuccessMessage(`Usted ha borrado el registro:`));
            
            const response = await DeleteEquipo(selectedEquipo?.equipoId);
            var data = response.data;
            if (data.errorMessage === '') 
            {
                let temp = selectedEquipo;
                temp.equipoId=-1;
                dispatch(ShowSuccessMessage(`Usted ha borrado el vehiculo con Id: ${temp.equipoId}`));
                handleOnCleanAll();
                setEquipos(new Array(temp));
                setLabelColor('code_segment_red');
            }
            else{
                dispatch(ShowWarningMessage(data.errorMessage));
            }
        }
    }

//======================================================================================================================================

    return(
        <Box>
            <Toolbar variant="dense" className="page_toolbar">
                <div style={{display:'flex',flexGrow:1}}>
                    <Tooltip title="Guardar" arrow enterDelay={1000}>
                        <IconButton disabled={IsSaveButtonEnabled()} size="small" edge="start" className="toolbar_button" onClick={handleOnSave}>
                            {/* {modeSave===ModeSave.IsADDING ?<Icon fontSize='medium'>save</Icon>:<Icon fontSize='medium'>save_as</Icon>} */}
                            {(modeSave===ModeSave.IsADDING && <Icon fontSize='medium'>save</Icon>) ||
                             (modeSave===ModeSave.IsEDITING && <Icon fontSize='medium'>save_as</Icon>) ||
                             (modeSave===ModeSave.IsAddingForNew && <Icon fontSize='medium'>add</Icon>) ||
                             (modeSave===ModeSave.IsAddingForSelect && <Icon fontSize='medium'>search</Icon>)}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Limpiar todo" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" className="toolbar_button" onClick={handleOnCleanAll}>
                            <Icon fontSize='medium'className="material-symbols-outlined">ink_eraser</Icon>
                        </IconButton>
                    </Tooltip>
                    <div className="separator"/>
                    <Tooltip title="Borrar" arrow enterDelay={1000}>
                        <IconButton disabled={IsDeleteButtonEnabled()} size="small" color="inherit" className="toolbar_button" onClick={handleDelete}>
                            <Icon fontSize='medium'>delete</Icon>
                        </IconButton>
                    </Tooltip>

                </div>
                <div style={{flexGrow: 1}}>
                    <Typography variant="h6" style={{color:'#0f80aa'}}>Equipos</Typography>
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
                    <MenuItem selected={filterField === 'marcafilter'} onClick={()=>handleCickMenu('marcafilter')}>
                        <ListItemText style={{width:'70px'}}>Marca</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'marcafilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'modelofilter'} onClick={()=>handleCickMenu('modelofilter')}>
                        <ListItemText style={{width:'70px'}}>Modelo</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'modelofilter' ? 'visible':'hidden'}}>done</Icon>
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
                                {equipos.length > 0 ?
                                equipos.map((value) => {
                                    return (
                                        <ListItem disablePadding>
                                            
                                            <ListItemButton
                                                classes={{root:classes.item_selected_root, selected:classes.item_selected}}
                                                selected={ equipo?.equipoId === value.equipoId}
                                                onClick={()=>handleSelectItem(value)}>
                                                    <div className="paged_card">
                                                        <div className={labelColor+'_left'}>
                                                            Marca
                                                        </div>
                                                        <div className={labelColor + "_right"}>
                                                            {value.marca}
                                                        </div>
                                                        <div className="name_segment">
                                                            <strong>Modelo:&nbsp;</strong>{value.modelo}
                                                        </div>
                                                        <div className="description_segment">
                                                        <strong>IMEI:&nbsp;</strong>{value.numeroIMEI}
                                                        </div>
                                                        <div className="description_segment">
                                                        <strong>Sind Card:&nbsp;</strong>{value.numeroSindCard}
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
                    <Grid container spacing={2} sx={{width:'60%',height:'150px'}}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="marca-label">Marca *</InputLabel>
                                <Select labelId="marca-label"
                                    required
                                    value={equipo.marca ?? ''}
                                    label="Marca"
                                    name="marca"
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
                                    value={equipo.modelo ?? ''}
                                    label="Modelo"
                                    name="modelo"
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
                            <TextField label="Numero IMEI"
                                required
                                autoComplete={false}
                                value={equipo.numeroIMEI ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name='numeroIMEI'/>
                        </Grid>                 
                        <Grid item xs={12} md={6}>
                            <TextField label="Numero SIND CARD"
                                autoComplete={false}
                                value={equipo.numeroSindCard ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name='numeroSindCard'/>
                        </Grid>
                    </Grid>
                </div>

            </Box>
        </Box>
    );
}

export default Equipos;