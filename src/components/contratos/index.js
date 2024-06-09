import React, { useEffect, useState } from "react";
import { Box, Stepper, Step, StepLabel, Divider, Button } from "@mui/material";
import { ColorlibConnector, ColorlibStepIcon } from "../utils/StepperMod";
import ClienteContrato from "./ClienteContrato";
import VehiculoContrato from "./VehiculoContrato";
import { clienteEmpty, vehiculoEmpty, planEmpty, equipoEmpty } from "../utils/Entities";
import PlanContrato from "./PlanContrato";
import { GetPlanesFiltrados } from "../../actions/PlanesAction";
import EquipoContrato from "./EquipoContrato";
import './style.css';
import Resumen from "./Resumen";
import ReactPDF, { PDFViewer } from "@react-pdf/renderer";
// import { MyPdfDocument } from "./MyPdfDocument";
import MyPdfDocument from "./MyPdfDocument";
import dayjs from "dayjs";

const steps = ['Cliente', 'Vehiculo', 'Plan','Equipo','Terminos'];


const Contratos = () => {
    
    const [cliente, setCliente] = useState(clienteEmpty);
    const [vehiculos, setVehiculos] = useState([vehiculoEmpty]);
    const [plan, setPlan] = useState(planEmpty);
    const [fechaDesde, setFechaDesde] = useState(new Date());
    const [fechaHasta, setFechaHasta] = useState(new Date());
    // const [equipo, setEquipo] = useState(equipoEmpty);

    const [cantidadVehiculos,setCantidadVehiculos] = useState(0);
    const [planesDisponibles, setPlanesDisponibles] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    // const [,dispatch] = useStateValue();

    useEffect(()=>{
        cargarDatosPlanes();
    },);

    useEffect(()=>{
        if(cantidadVehiculos > 0){
            let tmp=[];
            for(var i=0;i<cantidadVehiculos;i++){
                    tmp.push(vehiculoEmpty);
            }
            setVehiculos(tmp);
        }
    },[cantidadVehiculos]);

    const cargarDatosPlanes = async ()=>{
        await getPlanesFiltered(1,50,'','')
    }

    const getPlanesFiltered = async (pIndex,pSize,fField,fValue) => {
        var response = await GetPlanesFiltrados(pIndex,pSize,fField,fValue);
        var dataTemp = response?.data;
        if(dataTemp?.message === '')
        {
            setPlanesDisponibles(dataTemp.data);
        }
    }

    // const GoToFirstStep = () => {
    //     setActiveStep(0);
    // }

    const GoToNextStep = () => {
        setActiveStep(activeStep + 1);
    }

    const GoToPrevStep = () => {
        setActiveStep(activeStep - 1);
    }

    const GoToPdf = () => {
        GoToNextStep();
        
        // ReactPDF.render(<MyPdfDocument/>, `./example.pdf`);
        // ReactPDF.render(<MyPdfDocument/>, `${__dirname}/example.pdf`);

        // ReactPDF.renderToStream(<MyPdfDocument/>);

    }

    return(
        <Box>
            <Box className='container_area_contracts'>

                <div style={{display:'flex',width:'100%'}}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector/>} 
                            sx={{width:'100%',margin:'0',padding:'0',backgroundColor:''}}>
                        {steps.map((label, index) => 
                            {
                                const stepProps = {};
                                stepProps.completed = activeStep > index;
                                
                                // const labelProps = {};
                                // if (index===3) {
                                //     labelProps.optional = (
                                //       <Typography variant="caption">Opcional</Typography>
                                //     );
                                //   }
                                
                                return (
                                    <Step key={label} {...stepProps}>
                                        {/* <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}/> */}
                                        <StepLabel StepIconComponent={ColorlibStepIcon}/>
                                    </Step>
                                );
                            }
                        )}
                    </Stepper>
                </div>

                <Divider sx={{marginTop:'10px',marginBottom:'10px'}}/>

                <div>

                    {
                        // activeStep === steps.length &&
                        // (
                        //     <React.Fragment>
                        //         <Typography sx={{ mt: 2, mb: 1}}>
                        //             El contrato se ha completado!!!
                        //         </Typography>
                        //         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
                        //             <Box sx={{ flex: '1 1 auto' }} />
                        //             <Button onClick={GoToFirstStep}>Reset</Button>
                        //         </Box>
                        //     </React.Fragment>
                        // )|| 
                    (activeStep === 0 &&
                        (
                            <ClienteContrato
                                cantidadVehiculos={cantidadVehiculos}
                                setCantidadVehiculos={setCantidadVehiculos}
                                cliente={cliente}
                                setCliente={setCliente}
                                GoToNextStep={GoToNextStep}
                            />
                        ))
                    || (activeStep === 1 &&
                        (
                            <VehiculoContrato 
                                vehiculos={vehiculos}
                                setVehiculos={setVehiculos}
                                GoToNextStep={GoToNextStep}
                                GoToPrevStep={GoToPrevStep}
                            />
                        ))
                    || (activeStep === 2 &&
                        (
                            <PlanContrato
                                planesDisponibles={planesDisponibles}
                                setPlanesDisponibles={setPlanesDisponibles}
                                plan={plan}
                                setPlan={setPlan}
                                GoToNextStep={GoToNextStep}
                                GoToPrevStep={GoToPrevStep}
                            />
                        ))
                    || (activeStep === 3 &&
                        
                        (
                            <EquipoContrato
                                vehiculos={vehiculos}
                                setVehiculos={setVehiculos}
                                GoToNextStep={GoToNextStep}
                                GoToPrevStep={GoToPrevStep}
                            />
                        ))
                    || (activeStep === 4 &&
                        (
                            <Resumen
                                cliente={cliente}
                                plan={plan}
                                vehiculos={vehiculos}
                                fechaDesde={fechaDesde}
                                setFechaDesde={setFechaDesde}
                                fechaHasta={fechaHasta}
                                setFechaHasta={setFechaHasta}
                                GoToPrevStep={GoToPrevStep}
                                GoToPdf={GoToPdf}
                            />
                        ))
                    || (activeStep === 5 &&
                        (
                            <React.Fragment>

                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={GoToPrevStep}>Back</Button>
                                </Box>
                                
                                <PDFViewer showToolbar={true} style={{width:'100%',height:'calc(100vh - 205px)'}}>
                                    <MyPdfDocument 
                                        cliente={cliente}
                                        plan={plan}
                                        fechaDesde={fechaDesde}
                                        fechaHasta={fechaHasta}
                                        vehiculos={vehiculos}
                                    />
                                </PDFViewer>

                            </React.Fragment>
                        ))
                    }

                </div>

            </Box>
        </Box>
    );
}

export default Contratos;