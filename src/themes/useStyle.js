import { makeStyles } from "@mui/styles";
import theme from "./theme";

const useStyle = makeStyles({

    main_content_area: {
        height: 'calc(100vh - 75px)',
        width:'calc(100vw - 5px)',
        marginTop:'70px',
        marginLeft:'5px',
        marginRight:'10px'
        ,overflow: 'hidden'
    },
    containermt:
    {   
        marginTop:30
    },
    display_block:{
        display: 'block'
    },
    grow:
    {
        flexGrow: 1,
        [theme.breakpoints.up("md")]: { display: "flex" }
    },
    linkAppBarLogo:
    {
        display: "inline-flex",
        alignItems: "center",
        color:"inherit",
        textDecoration: "none"
    },
    mr:
    {
        marginRight:5
    },
    text_title:
    {
        fontWeight:600,
        minWidth:250,
        color: theme.palette.primary.main,
    },
    form: {
        marginTop:0,
        marginBotton:5
    },
    imageUploader: 
    {
        padding:0,
        margin: "-25px auto 10px",
        width: 0
    },
    avatarPerfil:
    {
        width:'120px !important'
        ,height:'120px !important'
        ,borderStyle:'solid !important'
        ,backgroundColor:theme.palette.primary.main
        ,borderColor:theme.palette.primary.main
    },
    gridmbtop: 
    {
        // marginTop:'8px !important'
    },
    divider: 
    {
        marginTop:12,
        marginBottom:12
        ,marginLeft:10
        ,width:'100%'
        ,height:'100%'
    },
    gridText:
    {
        maxWidth:400,
        margin:'auto'
    },
    Card: {
        padding:30
    },
    Avatar: {
        backgroundColor:"#0f80aa",
        width:80,
        height:80
    },
    newGrid: {
        marginBottom: 8
    },
    gridmb: {
        marginBotton: 20
    },
    link:{
        marginTop:8,
        fontSize:"1.1rem",
        fontFamily:"Roboto",
        lineHeight:1.5,
        color: theme.palette.primary.main,
        textDecoration:"none"
    },
    loginContainer: 
    {
        position: 'relative'
    },
    loginGrid: {
        position:'absolute',
        left: '25%',
        width: '100%',
        margin: '10% 0 0 -25%'
    },


    paged_list:{
        width: '300px',
        height:'calc(100vh - 140px)',
        minHeight:'200px',
        border:'3px solid lightgray',
        borderRadius:'8px',
    },
    list:{
        overflow: 'auto',
        height:'calc(100% - 50px)',
        // width:'250px'
    },
    paged_list_footer:{
        display:'grid',
        gridTemplateColumns:'65px auto 65px',
        height:'49px',
    },
    paged_list_footer_item:{
        margin:'auto',
    },
    content_area: {
        marginLeft:'10px',
        width:'100%',
        height:'calc(100vh - 140px)',
        border:'3px solid lightgray',
        borderRadius:'8px'
        ,overflow: 'auto'
        ,minHeight:'200px'
    }

    ,item_selected_root:{
        border:'3px solid #fff !important',
        padding:'6px !important'
    }
    ,item_selected:{
        border:'3px solid #0f80aa !important',
        borderRadius:'10px !important',
        padding:'6px !important',
    }

    ,menu_item_selected_root:{
        minHeight: 48,
        paddingLeft: 2.5,
        paddingRight: 2.5
    }
    ,menu_item_selected:{
        backgroundColor:'#0f81aa2f !important',
    }

    ,menu_item_icon_root:{
        marginRight:'-22px',
        justifyContent:"left !important",
    }
    

});

export default useStyle;

