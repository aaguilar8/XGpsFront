import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import RobotoFontBold from '../../../fonts/Roboto-Bold.ttf';
import { Grid, Icon } from "@mui/material";
import dayjs from "dayjs";

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: RobotoFontBold,
            fontWeight: 600,
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        flexDirection:'column',
        backgroundColor:'transparent',
    },
    section:{
        margin: 10,
        padding: 30,
        flexGrow: 1
    },
    title: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom:'20px'
    },
    head_separator: {
        padding:'3px 0px 1px 0px',
        fontSize: '8px',
        textAlign: 'center',
        backgroundColor:'lightgray',
        fontFamily:'Roboto',
        borderTop: '1px solid gray',
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },
    separator: {
        padding:'3px 0px 1px 0px',
        fontSize: '8px',
        textAlign: 'center',
        backgroundColor:'lightgray',
        fontFamily:'Roboto',
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },


    table: { 
        display: "table", 
        width: "auto", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderRightWidth: 0, 
        borderBottomWidth: 0 
    }, 
    tableRow: { 
        margin: "auto", 
        flexDirection: "row" 
    }, 
    tableCol_title: { 
        width: "20%", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderLeftWidth: 0, 
        borderTopWidth: 0
    }, 
    tableCell_title: { 
        fontFamily:'Roboto',
        fontSize: 8,
        margin: '3px', 
    },
    tableCol_content: { 
        width: "30%", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    }, 
    tableCell_content: { 
        margin: '3px', 
        fontSize: 8 
    },

    tableCol_header: {
        fontFamily:'Roboto', 
        textAlign: 'center',
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    },
    tableCol_units: { 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    },

    box:{
        flexDirection:'row',
        // width: "auto",
        width: "100%",
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: "gray",
        borderTopWidth:0,
        padding:'5px 35px 20px 35px'
    },
    text:{
        margin: '3px', 
        fontSize:8,
    },
    cuadro: {
        width: "10px",
        height: "10px",
        marginTop:"3px",
        border: "1px solid black", 
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },

    footer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 100,
        left: 40,
        right: 40,

        // border: '1px solid orangered'
    },
    footer_section: {
        width: '50%',
        textAlign: 'center',
        // border: '1px solid blue'
    },
    footer_text:{
        margin: '3px', 
        fontSize:12
    },
    line: {
        marginTop:'30px',
        fontSize:7
    },
    sign_text:{
        margin: '3px', 
        fontSize:10,
    },

});


const MyPdfDocument = (props) => {
    const { cliente, plan, fechaDesde,fechaHasta, vehiculos } = props;

    const getFormatedDate = (newDate) => {
        return newDate.format("DD/MM/YYYY");
    }
    
    const getDuracionContrato = () => {
        return dayjs(fechaHasta).add(1,'days').diff(fechaDesde,'months');
    }

    return(
        <Document title="Contrato"
            author="Alberth Aguilar"
            subject="Subject-test"
            keywords="Section"
            creator="aaguilar"
            producer="alex8agu"
            // pageMode="fullScreen"
            // pageLayout="twoPageLeft"
        >
            <Page size="LETTER" style={styles.page}>
                <View style={styles.section}>
                    
                    <Text style={styles.title}>SOLICITUD DE PRESTACIÓN DE SERVICIOS DE LOCALIZACIÓN SATELITAL</Text>
                    
                    {/* DATOS DEL CLIENTE */}
                    <Text style={styles.head_separator}>DATOS DEL CLIENTE</Text>
                    <View style={styles.table}>
                        
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Nombre/Razón Social</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.nombres} {cliente.apellidos}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Numero de identidad</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.numeroDocumento}</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Direccion Personal</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.direccionCliente}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Ciudad</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.municipioCliente}</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Numero de Telefono</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.telefono1}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Departamento</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.departamentoCliente}</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Correo Electronico</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.correoElectronico}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Numero de Emergencia</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{cliente.telefono1ContactoEmerg}</Text>
                            </View>
                        </View>

                    </View>

                    {/* SERVICIOS CONTRATADOS */}
                    <Text style={styles.separator}>SERVICIOS CONTRATADOS</Text>
                    <View style={styles.table}>
                        
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Fecha del Contrato</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{getFormatedDate(dayjs(fechaDesde))}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Duración del Contrato</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{getDuracionContrato()}</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Fecha de Vencimiento</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{getFormatedDate(dayjs(fechaHasta))}</Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Plan del Cliente</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{plan.nombre}</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Precio del Plan</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>
                                    {plan.moneda + ' ' + plan.precio?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                </Text>
                            </View>
                            <View style={styles.tableCol_title}>
                                <Text style={styles.tableCell_title}>Numero de Unidades</Text>
                            </View>
                            <View style={styles.tableCol_content}>
                                <Text style={styles.tableCell_content}>{vehiculos.length}</Text>
                            </View>
                        </View>

                    </View>

                    {/* DATOS DE LA UNIDAD */}
                    <Text style={styles.separator}>DATOS DE LA UNIDAD</Text>
                    <View style={styles.table}>
                        
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol_header,{width:'15%'}]}>
                                <Text style={styles.tableCell_content}>MARCA</Text>
                            </View>
                            <View style={[styles.tableCol_header,{width:'15%'}]}>
                                <Text style={styles.tableCell_content}>MODELO</Text>
                            </View>
                            <View style={[styles.tableCol_header,{width:'10%'}]}>
                                <Text style={styles.tableCell_content}>AÑO</Text>
                            </View>
                            <View style={[styles.tableCol_header,{width:'15%'}]}>
                                <Text style={styles.tableCell_content}>NUMERO PLACA</Text>
                            </View>
                            <View style={[styles.tableCol_header,{width:'15%'}]}>
                                <Text style={styles.tableCell_content}>COLOR</Text>
                            </View>
                            <View style={[styles.tableCol_header,{width:'30%'}]}>
                                <Text style={styles.tableCell_content}>FINANCIADO</Text>
                            </View>
                        </View>

                        {vehiculos.map((value) => {
                        return (
                            <View style={styles.tableRow}>
                                <View style={[styles.tableCol_units,{width:'15%'}]}>
                                    <Text style={styles.tableCell_content}>{value.marca}</Text>
                                </View>
                                <View style={[styles.tableCol_units,{width:'15%'}]}>
                                    <Text style={styles.tableCell_content}>{value.modelo}</Text>
                                </View>
                                <View style={[styles.tableCol_units,{width:'10%'}]}>
                                    <Text style={styles.tableCell_content}>{value.anio}</Text>
                                </View>
                                <View style={[styles.tableCol_units,{width:'15%'}]}>
                                    <Text style={styles.tableCell_content}>{value.placa}</Text>
                                </View>
                                <View style={[styles.tableCol_units,{width:'15%'}]}>
                                    <Text style={styles.tableCell_content}>{value.color}</Text>
                                </View>
                                <View style={[styles.tableCol_units,{width:'30%'}]}>
                                    <Text style={styles.tableCell_content}>{value.financiadoPor}</Text>
                                </View>
                            </View>
                        )})}

                    </View>

                    <View style={styles.box}>
                        <div style={styles.cuadro}/>
                        <Text style={styles.text}>
                            ACEPTACIÓN DEL CONTRATO Y SERVICIOS. - Con la firma del CLIENTE o de su representado legal, este acepta todas
                            y cada una de las estipulaciones del presente Contrato y los Servicios que en el se establecen.
                        </Text>
                    </View>

                    <View style={styles.box}>
                        <div style={styles.cuadro}/>
                        <Text style={styles.text}>
                            ACEPTO que me Explicaron el funcionamiento del sistema, los planes de venta y los precios con todas las condiciones
                            del servicio que estoy contratando.
                        </Text>
                    </View>

                    {/* <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} fixed /> */}

                </View>

                {/* FIRMAS */}
                <View style={styles.footer}>
                    <View style={styles.footer_section}>
                        <Text style={styles.sign_text}>EL CLIENTE *</Text>
                        <Text style={styles.line}>_______________________________________________________</Text>
                        <Text style={styles.sign_text}>{cliente.nombres} {cliente.apellidos}</Text>
                    </View>
                    <View style={styles.footer_section}>
                        <Text style={styles.sign_text}>* X-GPS *</Text>
                        <Text style={styles.line}>_______________________________________________________</Text>
                        <Text style={styles.sign_text}>-INSERTTAR AQUI REPRESENTANTE-</Text>
                    </View>
                </View>
            </Page>

        </Document>
    );
};

export default MyPdfDocument;

