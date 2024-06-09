import React, { useEffect, useState } from "react";
import { Box, Icon, IconButton, Toolbar, Tooltip, Typography, Pagination, List, Grid, TextField,
    Menu, MenuItem, ListItemText, Divider, InputBase,ListItem, ListItemButton, InputAdornment,
    FormControl, InputLabel, Select, 
    Switch} from "@mui/material";
import { ModeSave, button } from "../../types/types";
import { useStateValue } from "../../context/store";
import useStyle from "../../themes/useStyle";
import ConfirmationDialogYesNo from "../utils/ConfirmationDialogYesNo";
import { ShowErrorMessage, ShowSuccessMessage, ShowWarningMessage } from "../utils/messages";
import { GetSettinsgById } from "../../actions/ConfiguracionesAction";
import { NumericFormatCustom } from "../utils/NumericFormatCustom";
import './style.css';
import { AddNewPlan, DeletePlan, EditPlan, GetPlanesFiltrados } from "../../actions/PlanesAction";
import { planEmpty } from "../utils/Entities";


const Planes = () => {
    const [planes,setPlanes] = useState([]);
    const [plan,setPlan] = useState(planEmpty);
    const [selectedPlan,setSelectedPlan] = useState(planEmpty);
    const [modeSave,setModeSave] = useState(ModeSave.IsADDING);
    const [filterField,setFilterField] = useState('nofilter');
    const [filterValue,setFilterValue] = useState('');
    const [monedas,setMonedas] = useState([]);
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


    useEffect(()=>{
        cargarDatosMonedas();
    },[]);

    const cargarDatosMonedas = async ()=>{
        setMonedas(await cargarSettings('monedas'));
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
            const responseSave = await AddNewPlan(plan);
            var dataSave = responseSave?.data;
            if (dataSave.errorMessage === '') 
            {
                handleOnCleanAll();
                setPlanes(new Array(dataSave.data));
                setLabelColor('code_segment_green');
                dispatch(ShowSuccessMessage('Nuevo Plan registrado satisfactoriamente'));
            }
            else
            {
                dispatch(ShowErrorMessage(dataSave.errorMessage));
            }
        }
        else if(modeSave === ModeSave.IsEDITING){
            const responseEdit = await EditPlan(plan);
            var dataEdit = responseEdit?.data;
            if(dataEdit.errorMessage === '')
            {
                handleOnCleanAll();
                setPlanes(new Array(dataEdit.data));
                setLabelColor('code_segment_green');
                dispatch(ShowSuccessMessage('Plan editado satisfactoriamente'));
            }
            else
            {
                dispatch(ShowErrorMessage(dataEdit.errorMessage));
            }
        }
    }

    const handleDelete = () => {
        setOpenDialog(true);
    }

    const handleOnCleanAll = () => {
        setPlanes([]);
        setPlan(planEmpty);
        setSelectedPlan(planEmpty);
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
            getPlanesFiltered(1,pageSize,filterField,filterValue);
            setLabelColor('code_segment_blue');
        }
    }

    const getPlanesFiltered = async (pIndex,pSize,fField,fValue) => {
        var response = await GetPlanesFiltrados(pIndex,pSize,fField,fValue);
        var dataTemp = response?.data;
        if(dataTemp?.message === '')
        {
            setPlanes(dataTemp.data);
            setPlan(planEmpty);
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

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleCickMenu = (filter) => {
        setFilterField(filter);
        handleClose();
    }

    function IsSaveButtonEnabled(){
        if(modeSave === ModeSave.IsADDING){
            return !(plan.nombre.trim() !== '' &&
                plan.descripcion.trim() !== '' &&
                plan.moneda.trim() !== '' &&
                plan.precio > 0);
        }
        else if(modeSave === ModeSave.IsEDITING){
            let sePuedeModificar = ( selectedPlan.planId>0);
            let hayDiferencias = (selectedPlan.nombre !== plan.nombre ||
                        selectedPlan.descripcion !== plan.descripcion ||
                        selectedPlan.precio !== Number(plan.precio) ||
                        selectedPlan.moneda !== plan.moneda ||
                        selectedPlan.esPrecioEditable !== plan.esPrecioEditable );
            let camposLlenos = (plan.nombre.trim() !== '' &&
                        plan.descripcion.trim() !== '' &&
                        plan.precio >= 0 &&
                        plan.moneda.trim() !== '');

            let desabilitar = (sePuedeModificar && hayDiferencias && camposLlenos);
            return !desabilitar;
        }
        return true;
    }

    function IsDeleteButtonEnabled(){
        return (selectedPlan?.planId===0 || selectedPlan?.planId===-1);
    }

    const handleCloseConfirmationDialog = async (newValue) => {
        setOpenDialog(false);
        
        if(newValue && newValue===button.SI)
        {   
            const response = await DeletePlan(selectedPlan?.planId);
            var data = response.data;           
            if (data.errorMessage === '') 
            {
                let temp = selectedPlan;
                temp.planId=-1;
                dispatch(ShowSuccessMessage(`Usted ha borrado el Plan: ${temp.nombre}`));
                handleOnCleanAll();
                setPlanes(new Array(temp));
                setLabelColor('code_segment_red');
            }
            else{
                dispatch(ShowWarningMessage(data.errorMessage));
            }
        }
    }

    const handleSelectItem = (item) => {
        if(item.planId === plan.planId)
        {
            setPlan(planEmpty);
            setSelectedPlan(planEmpty);
            setModeSave(ModeSave.IsADDING);
        }
        else
        {
            setPlan(item);
            setSelectedPlan(item);
            setModeSave(ModeSave.IsEDITING);
        }
    }

    const handlePageChange = (event, value) => {
        setPageIndex(value);
        setPlan(planEmpty);
        getPlanesFiltered(value,pageSize,filterField,filterValue);
        setModeSave(ModeSave.IsADDING);
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setPlan(prev =>({
            ...prev,
            [name]:value
        }));
    }

    const handleChangeSwitch = (e) => {
        const {name,checked} = e.target;
        setPlan(prev =>({
            ...prev,
            [name]:checked
        }));
    }

    return(
        <Box>
            <Toolbar variant="dense" className="page_toolbar">
                <div style={{display:'flex',flexGrow:1}}>
                    <Tooltip title="Guardar" arrow enterDelay={1000}>
                        <IconButton disabled={IsSaveButtonEnabled()} size="small" edge="start" className="toolbar_button" onClick={handleOnSave}>
                            {modeSave===ModeSave.IsADDING ?<Icon fontSize='medium'>save</Icon>:<Icon fontSize='medium'>save_as</Icon>}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Limpiar todo" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" className="toolbar_button" onClick={handleOnCleanAll}>
                            <Icon fontSize='medium'className="material-symbols-outlined">ink_eraser</Icon>
                        </IconButton>
                    </Tooltip>
                    <div className="separator"></div>
                    <Tooltip title="Borrar" arrow enterDelay={1000}>
                        <IconButton disabled={IsDeleteButtonEnabled()} size="small" color="inherit" className="toolbar_button" onClick={handleDelete}>
                                <Icon fontSize='medium'>delete</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{flexGrow: 1}}>
                    <Typography variant="h6" style={{color:'#0f80aa'}}>Planes</Typography>
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
                onClose={handleClose}
                MenuListProps={{'aria-labelledby': 'basic-button'}}>
                    <MenuItem selected={filterField === 'nofilter'} onClick={()=>handleCickMenu('nofilter')}>
                        <ListItemText style={{width:'70px'}}><em>Sin filtro</em></ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'nofilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <Divider/>
                    <MenuItem selected={filterField === 'nombrefilter'} onClick={()=>handleCickMenu('nombrefilter')}>
                        <ListItemText style={{width:'70px'}}>Nombre</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'nombrefilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
                    <MenuItem selected={filterField === 'descripcionfilter'} onClick={()=>handleCickMenu('descripcionfilter')}>
                        <ListItemText style={{width:'70px'}}>Descripcion</ListItemText>
                        <Icon fontSize="small" sx={{visibility: filterField === 'descripcionfilter' ? 'visible':'hidden'}}>done</Icon>
                    </MenuItem>
            </Menu>

            <Box className='container_area_planes'>
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
                                {planes.length > 0 ?
                                planes.map((value) => {
                                    return (
                                        <ListItem disablePadding>
                                            
                                            <ListItemButton
                                                classes={{root:classes.item_selected_root, selected:classes.item_selected}}
                                                selected={ plan?.planId === value.planId}
                                                onClick={()=>handleSelectItem(value)}>
                                                    <div className="paged_card">
                                                        <div className={labelColor+'_left'}>
                                                            Nombre
                                                        </div>
                                                        <div className={labelColor + "_right"}>
                                                            {value.nombre}
                                                        </div>
                                                        <div className="price_segment">
                                                            <strong>Precio:&nbsp;</strong>{value.moneda}&nbsp;{value.precio}
                                                        </div>
                                                        <div className="description_segment">
                                                            {value.descripcion}
                                                        </div>
                                                        <div className="icon_segment">
                                                            {value.esPrecioEditable 
                                                            ? <Icon style={{color:'#b80000'}} className="material-symbols-outlined">lock_open_right</Icon>
                                                            : <Icon style={{color:'#0f80aa'}} className="material-symbols-outlined">lock</Icon>}
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
                <div className="body">
                    <Grid container spacing={2} sx={{width:'60%',height:'150px'}}>

                        <Grid item xs={12} md={6}>
                            <TextField label="Nombre"
                                required
                                autoComplete={false}
                                value={plan.nombre ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name='nombre'/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Descripcion"
                                required
                                autoComplete={false}
                                value={plan.descripcion ?? ''}
                                size="small"
                                variant="outlined" 
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name='descripcion'/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.gridmbtop} size="small">
                                <InputLabel id="moneda-label">Moneda *</InputLabel>
                                <Select labelId="moneda-label"
                                    required
                                    value={plan.moneda ?? ''}
                                    label="Moneda"
                                    name="moneda"
                                    onChange={handleChange}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <Divider/>
                                        {monedas.map((moneda) => (
                                            <MenuItem key={moneda.item} value={moneda.value}>
                                                {moneda.item} ({moneda.value})
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Precio"
                                required
                                autoComplete='false'
                                value={plan.precio ?? 0.00}
                                size="small"
                                variant="outlined"
                                fullWidth
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name="precio"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    inputProps: {decimalScale:2},
                                    startAdornment: <InputAdornment position="start">{plan.moneda ?? ''}</InputAdornment>
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField label="Precio Editable"
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
                                                name="esPrecioEditable"
                                                // disabled={modeSave === ModeSave.IsAddingForSelect}
                                                value={plan?.esPrecioEditable ?? false}
                                                checked={plan?.esPrecioEditable ?? false}
                                                onChange={handleChangeSwitch}
                                                />
                                            <Typography sx={{margin:'auto'}}>Si</Typography>
                                        </div>
                                    )
                                }}
                                />
                        </Grid>

                    </Grid>
                </div>
            </Box>
        </Box>
    );
}

export default Planes;