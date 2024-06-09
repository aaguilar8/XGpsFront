import { Box, Divider, Drawer, Fab, Grid, Icon, IconButton, List, ListItem, ListItemButton, 
    Pagination, Paper, TextField, Toolbar, Tooltip, Typography } 
from "@mui/material";
import React, { useState } from "react";
import useStyle from "../../themes/useStyle";
import { useEffect } from "react";
import { GetConfiguracionesPaginadas, 
    GuardarConfiguracionHeader,
    EditarConfiguracionHeader,
    EliminarConfiguracionHeader,
    GuardarConfiguracionDetail, 
    EliminarConfiguracionDetail,
    EditarConfiguracionDetail} 
from "../../actions/ConfiguracionesAction";
import { useStateValue } from "../../context/store";
import { button } from "../../types/types";
import {ShowSuccessMessage,ShowWarningMessage} from "../utils/messages";
import ConfirmationDialogYesNo from "../utils/ConfirmationDialogYesNo";
import './style.css';

const emptyConfig = {
    configuracionId:'',
    nombre:'',
    descripcion:''
};
const emptyDetail = {
    configuracionDetalleId:'',
    configuracionId:'',
    propiedad:'',
    valor:'',
    descripcion:'',
};

const Configurations = () => {

    const [listaConfig, setListaConfig] = useState([]);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [count, setCount] = useState(0);

    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selectedNombre, setSelectedNombre] = useState('');
    const [selectedDescripcion, setSelectedDescripcion] = useState('');
    
    const [open,setOpen] = useState(false);
    const [editState,setEditState] = useState('');
    const [newConfig,setNewConfig] = useState(emptyConfig);
    
    const [selectedDetailId,setSelectedDetailId] = useState('');
    const [openDetail,setOpenDetail] = useState(false);
    const [editStateDetail,setEditStateDetail] = useState('');
    const [newDetail,setNewDetail] = useState(emptyDetail);

    const [openDialog, setOpenDialog] = useState(false);
    const [deleteState,setDeleteState] = useState('');

    const [,dispatch] = useStateValue();

    const classes = useStyle();

    useEffect(()=>{
        getconfig(pageIndex,pageSize);
    },[]);

    const getconfig = async (index,size) => {
        
        var response = await GetConfiguracionesPaginadas(size,index);
        var dataTemp = response.data;
        if(dataTemp.message === '')
        {
            setListaConfig(dataTemp.data);
            setPageIndex(dataTemp.pageIndex);
            setPageSize(dataTemp.pageSize);
            setPageCount(dataTemp.pageCount);
            setCount(dataTemp.count);

            // if(selectedId!=='')
            // {
            //     let item = data.data.find((element)=>{return element.configuracionId === selectedId});
            //     setSelectedItem(item?.configuracionesDetalles??[]);
            // }
        }
    }

    const handlePageChange = (event, value) => {
        setPageIndex(value);
        getconfig(value,pageSize);
        setSelectedId('');
        setSelectedNombre('');
        setSelectedDescripcion('');
        setSelectedItem([]);
    }

    const handleSelectItem = (item) => {
        setSelectedId(item.configuracionId);
        setSelectedNombre(item.nombre);
        setSelectedDescripcion(item.descripcion);
        setSelectedItem(item.configuracionesDetalles);
    }

    const handleCloseDrawerDetail = (stateDetail,editStateDetailP) => {
        setEditStateDetail(editStateDetailP);
        setOpenDetail(stateDetail);
        
        if(editStateDetailP==='addingDetail')
        {
            setNewDetail(emptyDetail);
        }
        // else if(editStateDetailP==='editingDetail'){}
        else if(editStateDetailP==='loadingDetail')
        {
            getconfig(1,pageSize);
            setSelectedItem([]);
            getconfig(1,pageSize);
        }
    }

    const handleCloseDrawer = (state,editStateP) => {
        setEditState(editStateP);
        setOpen(state);

        if(editStateP==='adding') 
        {
            setNewConfig(emptyConfig);

        }
        else if(editStateP==='editing') 
        {
            setNewConfig(
                {
                    configuracionId:selectedId,
                    nombre:selectedNombre,
                    descripcion:selectedDescripcion
                });
        }
        else if(editStateP==='loading')
        {
            setSelectedId('');
            setSelectedItem([]);
            getconfig(1,pageSize);
        }
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setNewConfig(prev =>({
            ...prev,
            [name]:value
        }));
    }

    const handleChangeDetail = (e) => {
        const {name,value} = e.target;
        setNewDetail(prev =>({
            ...prev,
            [name]:value
        }));
    }

    const handleSaveConfig = async () => {
        let param={
            configuraciones:{
                configuracionId: newConfig.configuracionId,
                nombre: newConfig.nombre,
                descripcion: newConfig.descripcion
            }
        }
        const response = await GuardarConfiguracionHeader(param);
        var data = response.data;
        if (data.errorMessage === '') 
        {
            handleCloseDrawer(false,'loading');
            dispatch(ShowSuccessMessage('Se ha creado una nueva configuracion satisfactoriaemte'));
        }
    }

    const handleEditConfig = async () => {
        let param={
            configuraciones:{
                configuracionId: newConfig.configuracionId,
                nombre: newConfig.nombre,
                descripcion: newConfig.descripcion
            }
        }
        const response = await EditarConfiguracionHeader(param);
        var data = response.data;
        if (data.errorMessage === '') 
        {
            handleCloseDrawer(false,'loading');
            dispatch(ShowSuccessMessage('Se ha editado a configuracion satisfactoriaemte'));
        }
    }

    const handleDeleteConfig = async () => {
        setDeleteState('header');
        setOpenDialog(true);
    }

    const handleSaveDetail = async () => {
        let param={
            ConfiguracionesDetalle:{
                configuracionId: selectedId,
                propiedad: newDetail.propiedad,
                valor: newDetail.valor,
                descripcion:newDetail.descripcion
            }
        }
        const response = await GuardarConfiguracionDetail(param);
        var data = response.data;
        if (data.errorMessage === '') 
        {
            handleCloseDrawerDetail(false,'loadingDetail');
            dispatch(ShowSuccessMessage('Se ha creado un nuevo detalle de configuracion satisfactoriaemte'));
        }
    }

    const handleEditDetail = async () => {
        let param={
            ConfiguracionesDetalle:{
                configuracionDetalleId:newDetail.configuracionDetalleId,
                configuracionId: newDetail.configuracionId,
                propiedad: newDetail.propiedad,
                valor: newDetail.valor,
                descripcion: newDetail.descripcion,
            }
        }
        const response = await EditarConfiguracionDetail(param);
        var data = response.data;
        if (data.errorMessage === '') 
        {
            handleCloseDrawerDetail(false,'loadingDetail');
            dispatch(ShowSuccessMessage('Se ha editado el detalle de la configuracion satisfactoriaemte'));
        }
    }

    function isButtonEnabled(){
        return !(newConfig.configuracionId!=='' && newConfig.nombre!=='' && newConfig.descripcion!=='');
    }

    function isButtonDetailEnabled(){
        return !(newDetail.propiedad!=='' && newDetail.valor!=='' && newDetail.descripcion!=='');
    }

    const handleCallEditDetail = (value) => {
        setNewDetail({
            configuracionDetalleId: value.configuracionDetalleId,
            configuracionId: value.configuracionId,
            descripcion: value.descripcion,
            propiedad: value.propiedad,
            valor: value.valor
        });

        handleCloseDrawerDetail(true,'editingDetail')
    }

    const handleCallDeleteDetail = (value) => {
        setDeleteState('detail');
        setSelectedDetailId(value.configuracionDetalleId);
        setOpenDialog(true);
    }

    const handleCloseConfirmationDialog = async (newValue) => {
        setOpenDialog(false);
        
        if(newValue && newValue===button.SI)
        {
            dispatch(ShowSuccessMessage(`Usted ha borrado el registro: ${deleteState}`));
            if(deleteState === 'header')
            {
                const response = await EliminarConfiguracionHeader(selectedId);
                var data = response.data;
                if (data.errorMessage === '') 
                {
                    dispatch(ShowSuccessMessage(`Usted ha borrado la configuracion; ${selectedId}`));

                    setSelectedId('');
                    setSelectedNombre('');
                    setSelectedDescripcion('');
                    setSelectedItem([]);
                    getconfig(1,pageSize);
                }
                else{
                    dispatch(ShowWarningMessage(data.errorMessage));
                }
            }
            else if(deleteState === 'detail') 
            {
                const response = await EliminarConfiguracionDetail(selectedId,selectedDetailId);
                var dataTemp = response.data;
                if (dataTemp.errorMessage === '') 
                {
                    dispatch(ShowSuccessMessage(`Usted ha borrado el detalle; ${selectedDetailId}`));

                    setSelectedId('');
                    setSelectedNombre('');
                    setSelectedDescripcion('');
                    setSelectedItem([]);
                    getconfig(1,pageSize);
                }
                else
                {
                    dispatch(ShowWarningMessage(dataTemp.errorMessage));
                }
            }
        }
    }
    
    return(
        // <Box sx={{backgroundColor:'white',height:'90vh',width:'98%',marginLeft:1}}>
        <Box>
            <Toolbar variant="dense" className="page_toolbar">
                <div style={{display:'flex',flexGrow:1}}>
                    <Tooltip title="Nuevo" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" edge="start" className="toolbar_button"
                            onClick={()=>handleCloseDrawer(true,'adding')}>
                                <Icon fontSize='medium'>library_addadd_circle</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" disabled={selectedId===''} className="toolbar_button"
                            onClick={()=>handleCloseDrawer(true,'editing')}>
                                <Icon fontSize='medium'>edit</Icon>
                        </IconButton>
                    </Tooltip>
                    <div className="separator"/>
                    <Tooltip title="Borrar" arrow enterDelay={1000}>
                        <IconButton size="small" color="inherit" disabled={selectedId===''} className="toolbar_button"
                            onClick={handleDeleteConfig}>
                                <Icon fontSize='medium'>delete</Icon>
                        </IconButton>
                    </Tooltip>
                </div>

                <div style={{flexGrow: 1}}>
                    <Typography variant="h6" style={{color:'#0f80aa'}}>Configuraciones</Typography>
                </div>
                <div style={{flexGrow: 1}}/>
            </Toolbar>

            <Drawer open={open} onClose={()=>handleCloseDrawer(false,'')} anchor='right' >
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="drawer_content_area">
                        <div className="title">
                            <Typography variant="h5" gutterBottom align="center">
                                {editState==='adding' ? 'Agregar Configuracion' : editState==='editing' ? 'Editar Configuracion': ''}
                            </Typography>
                        </div>
                        <Divider/>
                        <div className="content">
                            <TextField name="configuracionId" 
                                className="etiqueta"
                                value={newConfig.configuracionId} 
                                label="ID Configuracion" 
                                size="small" 
                                variant="outlined"
                                disabled={editState==='editing'}
                                onChange={handleChange}
                                fullWidth/>
                            <TextField name="nombre" 
                                className="etiqueta" 
                                value={newConfig.nombre} 
                                label="Nombre" 
                                size="small" 
                                variant="outlined" 
                                onChange={handleChange}
                                fullWidth/>
                            <TextField name="descripcion" 
                                className="etiqueta" 
                                value={newConfig.descripcion} 
                                label="Descripcion" 
                                size="small" 
                                variant="outlined" 
                                onChange={handleChange}
                                fullWidth/>
                        </div>
                        <Divider/>
                        <div className="footer">
                            <IconButton size="medium" 
                                color="inherit" 
                                edge="start" 
                                className="button" 
                                onClick={()=>handleCloseDrawer(false,'')}>
                                    <Icon fontSize='medium'className="material-symbols-outlined">reply</Icon>
                            </IconButton>
                            <div className="spacing"/>
                            
                            {editState==='adding' ?
                            <IconButton size="medium"
                                disabled={isButtonEnabled()}
                                color="inherit"  
                                className="button" 
                                onClick={handleSaveConfig}>
                                    <Icon fontSize='medium'>save</Icon>
                            </IconButton>
                            :
                            <IconButton size="medium"
                                disabled={isButtonEnabled()}
                                color="inherit"  
                                className="button" 
                                onClick={handleEditConfig}>
                                    <Icon fontSize='medium'>edit</Icon>
                            </IconButton>
                            }

                        </div>
                    </div>
                </form>
            </Drawer>

            <Drawer open={openDetail} onClose={()=>handleCloseDrawerDetail(false,'')} anchor='right' >
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="drawer_content_area">
                        <div className="title">
                            <Typography variant="h5" gutterBottom align="center">
                                {editStateDetail==='addingDetail' ? 'Agregar Detalle' : editStateDetail==='editingDetail' ? 'Editar Detalle': 'Sin Titulo'}
                            </Typography>
                        </div>
                        <Divider/>
                        <div className="content">
                            <TextField name="configuracionIdDetalle" 
                                className="etiqueta"
                                value={selectedId} 
                                label="ID Configuracion" 
                                size="small" 
                                variant="outlined"
                                disabled
                                fullWidth/>
                            
                            <TextField name="propiedad" 
                                className="etiqueta" 
                                value={newDetail.propiedad}  
                                label="Propiedad" 
                                size="small" 
                                variant="outlined" 
                                onChange={handleChangeDetail}
                                fullWidth/>
                            <TextField name="valor" 
                                className="etiqueta" 
                                value={newDetail.valor} 
                                label="Valor" 
                                size="small" 
                                variant="outlined" 
                                onChange={handleChangeDetail}
                                fullWidth/>
                            <TextField name="descripcion" 
                                className="etiqueta" 
                                value={newDetail.descripcion}
                                label="Descripcion" 
                                size="small" 
                                variant="outlined" 
                                onChange={handleChangeDetail}
                                fullWidth/>
                            
                        </div>
                        <Divider/>
                        <div className="footer">
                            <IconButton size="medium" 
                                color="inherit" 
                                edge="start" 
                                className="button" 
                                onClick={()=>handleCloseDrawerDetail(false,'')}>
                                    <Icon fontSize='medium'className="material-symbols-outlined">reply</Icon>
                            </IconButton>
                            <div className="spacing"/>
                            
                            {editStateDetail==='addingDetail' ?
                            <IconButton size="medium"
                                disabled={isButtonDetailEnabled()}
                                color="inherit"  
                                className="button" 
                                onClick={handleSaveDetail}
                                >
                                    <Icon fontSize='medium'>save</Icon>
                            </IconButton>
                            :
                            <IconButton size="medium"
                                disabled={isButtonDetailEnabled()}
                                color="inherit"  
                                className="button" 
                                onClick={handleEditDetail}
                                >
                                    <Icon fontSize='medium'>edit</Icon>
                            </IconButton>
                            }

                        </div>
                    </div>
                </form>
            </Drawer>

            <ConfirmationDialogYesNo id="sino"
                keepMounted
                open={openDialog}
                onClose={handleCloseConfirmationDialog}
                title="Esta seguro?"
                content="Desea realmente eliminar este registro?"/>
            
            <Box className='container_area'>
                <div className={classes.paged_list}>
                    <List className={classes.list}>
                        {listaConfig.map((value) => {
                            return (
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        classes={{root:classes.item_selected_root, selected:classes.item_selected}}
                                        // classes={{root:classes.item}}
                                        selected={ selectedId === value.configuracionId }
                                        onClick={()=>handleSelectItem(value)}>
                                        
                                        <div className="paged_card">
                                            <div className="code_segment_blue_left">
                                                Config Id
                                            </div>
                                            <div className="code_segment_blue_right">
                                                {value.configuracionId}
                                            </div>
                                            <div className="name_segment">
                                                {value.nombre}
                                            </div>
                                            <div className="description_segment">
                                                {value.descripcion}
                                            </div>
                                        </div>
                                        
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <Divider/>
                    <div style={{width:'100%',height:'50px'}}>
                        <div style={{width:'max-content',margin:'2px auto'}}>
                            <Pagination 
                                // sx={{margin:'auto',backgroundColor:'blue',width:'90%',height:'30px'}}
                                size="small" 
                                count={pageCount} 
                                siblingCount={0} 
                                boundaryCount={1} 
                                page={pageIndex} 
                                onChange={handlePageChange}/>
                        </div>
                        <div style={{width:'max-content',margin:'auto',fontSize:'12px',marginTop:'2px'}}>
                            {/* Texto de prueba */}
                            Item por pagina: <strong>{pageSize}</strong>, Total: <strong>{count}</strong>
                        </div>
                    </div>
                </div>
                <div className={classes.content_area}>
                    <Grid container spacing={1} columns={12} sx={{padding:'5px 10px'}}>
                        {selectedItem.map((value, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{width:'100px',height:'125px'}}>
                                 <Paper elevation={5} sx={{width:'100%',height:'100%'}}>
                                    <div style={{backgroundColor:'whitesmoke',width:'100%',height:'100%'}}>
                                        <div style={{margin:'5px 5px 5px 5px'}}>
                                            <div style={{backgroundColor: '#0f80aa',borderRadius:'4px 4px 0 0',color:'white',padding:'0 0 0 5px',fontWeight:'bold'}} >
                                                {value.propiedad}
                                            </div>
                                            <div>{value.valor}</div>
                                            <div style={{fontSize:'14px'}}>{value.descripcion}</div>
                                        </div>
                                        <Divider/>
                                        <div className="card_bottons">
                                            <IconButton className="boton_delete" onClick={()=>handleCallDeleteDetail(value)}>
                                                <Icon fontSize="small">delete</Icon>
                                            </IconButton>
                                            <IconButton className="boton_edit" onClick={()=>handleCallEditDetail(value)}>
                                                <Icon fontSize="small">edit</Icon>
                                            </IconButton>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                        ))}

                        {selectedId!=='' ?
                        <Grid item xs={12} sm={6} md={4} lg={3} sx={{width:'100px',height:'125px'}}>
                            <Paper elevation={5} sx={{width:'100%',height:'100%'}}>
                                <div style={{margin:'5px 5px 5px 5px'}}>
                                    <Fab size="small" 
                                        sx={{backgroundColor:"#0f80aa",position: 'relative',top:'35px',left:'120px'}}
                                        onClick={()=>handleCloseDrawerDetail(true,'addingDetail')}>
                                            <Icon style={{color:"white"}} fontSize='large'>add</Icon>
                                    </Fab>
                                </div>
                            </Paper>
                        </Grid>
                        :<></> }

                    </Grid>

                </div>
            </Box>

        </Box>
    );
}

export default Configurations;