import { Alert, AppBar, Avatar, Button, Card, Container, Grid, Icon, IconButton, Slide, Snackbar, Stack, TextField, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useStyle from '../../themes/useStyle';
import { useStateValue } from '../../context/store'
import { loginUsuario } from '../../actions/UsuarioAction';

const clearUsuario = {
    username: 'aaguilar',
    password: 'EstoEsUnUsuarioDePrueba$2023'
}

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const userNameLabel = 'UserName'

const Login = () => {
    const [usuario, setUsuario] = useState(clearUsuario);
    const [state,setState] = useState({open: false,Transition: SlideTransition});
    const [severitySnackBar,setSeveritySnackBar] = useState('success');
    const [message,setMessage] = useState('');

    const navigate = useNavigate();
    const classes = useStyle();
    const [{sesionUsuario},dispatch] = useStateValue();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUsuario( prev => ({...prev, [name]:value}));
    }


    const loginUser = () => {
        if(usuario.username === '' || usuario.password === '')
        {
            setSeveritySnackBar('warning');
            setMessage('Debe ingresar el usuario y la contraseña');
            setState({...state,open:true});
            return;
        }

        loginUsuario(usuario,dispatch)
            .then((response) => {
                if (response.status === 200) {
                    window.localStorage.setItem('token', response.data.token);
                    navigate('/main');
                }
                else {
                    setSeveritySnackBar('warning');
                    setMessage('El usuario o la contraseña son incorrectos');
                    setState({...state,open:true});
                    return;
                }
            });
    }

    const handleCloseSnackBar = (event,reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setState({...state,open:false});
    };

    return(
        <Container className={classes.loginContainer}>
            
            {/* <AppBar>
                <Toolbar>
                    <IconButton>

                    </IconButton>
                </Toolbar>
            </AppBar> */}

            <Snackbar
                open={state.open}
                anchorOrigin={{vertical: 'top',horizontal: 'right'}}
                sx={{marginTop:8}}
                onClose={handleCloseSnackBar}
                TransitionComponent={state.Transition}
                key={state.Transition.name}
                autoHideDuration={4000}
            >
                <Alert onClose={handleCloseSnackBar} severity={severitySnackBar} variant='filled' sx={{width:'100%'}}>
                    <strong>{message}</strong>
                </Alert>
            </Snackbar>
            <Grid container justifyContent="center" className={classes.loginGrid}>
                <Grid item xs={10} sm={6} md={6} lg={5} xl={4}>
                    <Card elevation={10} align="center" className={classes.Card} sx={{borderRadius:5}}>
                        <Avatar sx={{backgroundColor:"#0f80aa",width:80,height:80}}>
                            <Icon sx={{fontSize:65}}>person</Icon>
                        </Avatar>
                        <Typography variant='h5' color='primary' sx={{marginTop:2,marginBottom:2}}>Auntenticación</Typography>
                        <form onSubmit={(e) => e.preventDefault()} className={classes.form}>
                            <Grid container spacing={2} className={classes.newGrid}>
                                <Grid item xs={12} className={classes.gridmb}>
                                    <TextField label={userNameLabel}
                                        autoFocus={true}
                                        variant='outlined' 
                                        fullWidth 
                                        type='text' 
                                        name="username" 
                                        value={usuario.username} 
                                        onChange={handleChange}/>
                                </Grid>
                                <Grid item xs={12} className={classes.gridmb}>
                                    <TextField label="Password" 
                                        variant='outlined' 
                                        fullWidth 
                                        type="password" 
                                        name="password" 
                                        value={usuario.password} 
                                        onChange={handleChange}/>
                                </Grid>
                                <Grid item xs={12} className={classes.gridmb}>
                                    <Button variant='contained' fullWidth color='primary' type="submit" onClick={loginUser}>
                                        Ingresar
                                    </Button>
                                </Grid>
                            </Grid>
                            <Link to='/main' variant='body1' className={classes.link}>¿Olvidaste tu contraseña?</Link>
                        </form>
                    </Card>
                </Grid>
            </Grid>
            
        </Container>
    );
}

export default Login;