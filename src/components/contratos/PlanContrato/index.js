import React, { useState } from "react";
import { Box, Icon, Tooltip, Grid, Divider, Button, List, ListItem, ListItemButton, 
    TextField, Dialog, DialogTitle, DialogContent, InputAdornment, DialogActions, FormControl } from "@mui/material";
import { planEmpty } from "../../utils/Entities";
import { useStateValue } from "../../../context/store";
import useStyle from "../../../themes/useStyle";
import { NumericFormatCustom } from "../../utils/NumericFormatCustom";
import './style.css';


const PlanContrato = (props) => {
    const { planesDisponibles, setPlanesDisponibles, plan, setPlan, GoToNextStep, GoToPrevStep } = props;
    const [,dispatch] = useStateValue();
    const [openDialog, setOpenDialog] = useState(false);
    const [index,setIndex] = useState(-1);
    const [planesTemportales,setPlanesTemportales] = useState(planesDisponibles);

    const classes = useStyle();

    const handleSelectItem = (item) => {
        if(item.planId === plan.planId){
            setPlan(planEmpty);
        }
        else{
            setPlan(item);
        }
    };

    const handleDoubleClick = (item,index) => {
        if(item.esPrecioEditable){
            setIndex(index);
            setPlan(item);
            setOpenDialog(true);
        }
    }

    const handleCloseDialog = () => {
        let temp = planesTemportales.slice();
        temp[index] = plan;

        setPlanesTemportales(temp);
        setPlanesDisponibles(temp);

        setIndex(-1);
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const {name,value} = e.target;
        setPlan(prev =>({
            ...prev,
            [name]:Number(value)
        }));
    }


    return(
        <Box>

            <Dialog
                // fullWidth={fullWidth}
                // maxWidth={maxWidth}
                open={openDialog}
                onClose={handleCloseDialog}
                >
                <DialogTitle>{plan.nombre}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        {plan.nombre}
                    </DialogContentText> */}
                    <Box
                        // noValidate
                        // component="form"
                        sx={{display: 'flex',flexDirection: 'column',m: 'auto',width: 'fit-content'}}
                    >
                         <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <TextField label="Precio"
                                value={plan.precio}
                                size="small"
                                variant="outlined"
                                fullWidth
                                sx={{marginTop:'8px'}}
                                className={classes.gridmbtop}
                                onChange={handleChange}
                                name="precio"
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                    startAdornment: <InputAdornment position="start">{plan.moneda ?? ''}</InputAdornment>
                                }}
                            />
                            </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <div className="body_plan_contrato">

                <Box className='navigation_bar'>
                    <Tooltip title="Paso previo" arrow enterDelay={1000}>
                        <Button className="boton_id_prev" onClick={GoToPrevStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_before</Icon>
                        </Button>
                    </Tooltip>
                    <Box sx={{ flex: '1 1 auto'}}>
                        <div className="title">Planes</div>
                    </Box>
                    <Tooltip title="Paso siguiente" arrow enterDelay={1000}>
                        {/* <Button disabled={!(plan.planId > 0)} className="boton_id_next" onClick={GoToNextStep}> */}
                        <Button className="boton_id_next" onClick={GoToNextStep}>
                            <Icon sx={{color:'#0f80aa'}} fontSize='large'>navigate_next</Icon>
                        </Button>
                    </Tooltip>
                </Box>

                <Divider/>

                <Grid container spacing={2} className="body">
                    <Grid item xs={12} sm={1} md={2} lg={2} xl={3}>
                        <div>{plan.planid}</div>
                        <div>{plan.nombre}</div>
                        <div>{plan.descripcion}</div>
                        <div>{plan.moneda}</div>
                        <div>{plan.precio}</div>
                        <div>INDICE: ({index})</div>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8} lg={8} xl={6}>
                        <List className="lista">
                            {planesTemportales.length > 0 ? 
                                planesTemportales.map((value,index) => {
                                        return (
                                        <ListItem>
                                            <Tooltip disableHoverListener={!value.esPrecioEditable} title="Doble cklick, para editar el valor del plan." arrow>
                                                <ListItemButton 
                                                    classes={{root:'root_item', selected:'selected_item'}}
                                                    selected={ value.planId === plan.planId }
                                                    onDoubleClick={()=>handleDoubleClick(value,index)}
                                                    onClick={()=>handleSelectItem(value)}>
                                                        <div className="item_name">{value.nombre}</div>
                                                        <div className="item_description">{value.descripcion}</div>
                                                        {/* {value.esPrecioEditable 
                                                        ? 
                                                        <div className="item_price">
                                                            {value.moneda} {value.precio}
                                                        </div>
                                                        :  */}
                                                        <div className="item_price">
                                                            {value.moneda} {value.precio?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                                            {value.esPrecioEditable ? <Icon sx={{padding:'3px 0 0 3px',border:'0px solid gray',width:'25px',height:'23px'}}>edit</Icon>: <></>}
                                                        </div>
                                                        {/* } */}
                                                </ListItemButton>
                                            </Tooltip>
                                        </ListItem>
                                        );
                                    })
                            :<div style={{textAlign:'center',fontWeight:'bold'}}>No hay datos</div>}
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={1} md={2} lg={2} xl={3}/>
                </Grid>

            </div>
            

        </Box>
    );
}

export default PlanContrato;