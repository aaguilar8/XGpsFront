import React, { useState } from "react"
import { Avatar, Box, Button, Container, Divider, Grid, Icon, TextField, Toolbar, Typography } from "@mui/material";
import ImageUploader from 'react-images-upload';
import useStyle from "../../themes/useStyle";
import { registrarUsuario } from "../../actions/UsuarioAction";

const emptyUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    imagen:'',
    imagenTemporal:'',
    file:''
}

const Perfil = () => {
    const [user,setUser] = useState(emptyUser);
    const classes = useStyle();

    const guardarDatos = () => {
        
        const user =
        {
            email:"test@hotmail.com",
            password:"Test_Prueba*2024",
            nombre:"test",
            apellido:"prueba",
            username:"tprueba"
        }
        
        registrarUsuario(user).then(response => {
            console.log('respuesta desde el server: ',response);
            window.localStorage.setItem('TOKEN',response.data.token);
        });

    }

    const subirImagen = (imagenes) => {
        debugger
        let foto = imagenes[0];
        let fotoUrl = '';
        try{
            fotoUrl = URL.createObjectURL(foto);
        }
        catch(e){
            console.log(e);
        }

        setUser( (prev) => ({
            ...prev,
            file: foto,
            imagenTemporal: fotoUrl
        }));
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setUser(prev =>({
            ...prev,
            [name]:value
        }));
    }

    return(
        <Box sx={{backgroundColor:'white',height:'90vh',width:'98%',marginLeft:1}}>
            <Toolbar variant="dense" sx={{backgroundColor:'lightgray',borderRadius:3}}>
                <div style={{margin:'auto',flexGrow: 1}}>
                    <Typography variant="h6" align="center" style={{color:'#0f80aa'}}>Perfil de usuario</Typography>
                </div>
            </Toolbar>

            <Container style={{maxWidth:800}}> 
                <Grid container spacing={1}>
                    <Grid item sx={{margin:'auto'}}>                
                        <form onSubmit={(e) => e.preventDefault()} className={classes.form}>
                            <ImageUploader 
                                onChange={subirImagen}
                                className={classes.imageUploader}
                                withIcon={false}
                                singleImage={true}
                                buttonStyles={{padding:0, margin:0, position:"absolute", bottom:20, left:20,height:'35px', width:'35px'}}
                                buttonText={<Icon>add_a_photo</Icon>}
                                label={
                                    <Avatar
                                        className={classes.avatarPerfil}
                                        src={user.imagenTemporal ? user.imagenTemporal : (user.imagen ? user.imagen : '')}
                                    />}
                                imgExtension={['.jpg','.gif','.png','.jpeg']}
                                maxFileSize={5242880}
                            />

                            <Grid container spacing={2}>

                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="Nombre"
                                        size="small"
                                        error={false}
                                        variant="outlined" 
                                        fullWidth 
                                        className={classes.gridmbtop} 
                                        name='name' 
                                        helperText=""
                                        value={user.name}
                                        onChange={handleChange} />
                                </Grid>

                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="Apellidos"
                                        size="small"  
                                        variant="outlined" 
                                        fullWidth 
                                        className={classes.gridmbtop} 
                                        name='lastname'
                                        value={user.lastname}
                                        onChange={handleChange} />
                                </Grid>

                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="Correo electronico" 
                                        size="small" 
                                        variant="outlined" 
                                        fullWidth 
                                        className={classes.gridmbtop} 
                                        name='email'
                                        value={user.email}
                                        onChange={handleChange}/>
                                </Grid>

                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="User name"
                                        size="small" 
                                        variant="outlined" 
                                        fullWidth 
                                        className={classes.gridmbtop} 
                                        name='username'
                                        value={user.username}
                                        onChange={handleChange}/>
                                </Grid>

                                <Divider className={classes.divider}/>

                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="Password"
                                        size="small" 
                                        variant="outlined" 
                                        fullWidth 
                                        type="password" 
                                        autoComplete="current-password" 
                                        className={classes.gridmbtop}
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.gridText}>
                                    <TextField label="Confirmar Password"
                                        size="small" 
                                        variant="outlined" 
                                        fullWidth 
                                        type="password" 
                                        autoComplete="current-password" 
                                        className={classes.gridmbtop}
                                        name="confirmPassword"
                                        value={user.confirmPassword}
                                        onChange={handleChange} />
                                </Grid>

                                <Divider className={classes.divider}/>

                            </Grid>

                            <Button variant="contained" color="primary" onClick={guardarDatos}>
                                    ACTUALIZAR
                            </Button>

                        </form>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )

}

export default Perfil;