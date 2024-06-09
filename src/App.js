import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Slide, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import Login from './components/login';
import { getUsuario } from './actions/UsuarioAction';
import { useStateValue } from './context/store';
import PrivateRoute from './routes/privateRoute';
import PagesRoutes from './routes/pagesRoutes';
import theme from './themes/theme';
import { types } from './types/types';


function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

function App() {
  const [{openSnackBar},dispatch] = useStateValue();
  const [servidorRespuesta, setServidorRespuesta] = useState(false);  
  const [customTheme, ] = useState(theme); 
  const [state,setState] = useState({open: false,Transition: SlideTransition});

  useEffect(() => {
    if (!servidorRespuesta) {
      getUsuario(dispatch);
      setServidorRespuesta(true);
    }
  },[servidorRespuesta]);
  
  const handleCloseSnackBar = (event,reason) => {
    if(reason === 'clickaway'){
        return;
      }
      dispatch({
        type:types.closeSnackBar,
        openMessage: {message:'',severity:openSnackBar.severity},
      });
  };

  return (
    <ThemeProvider theme={customTheme}>
      
      <Snackbar
        open={openSnackBar ? openSnackBar.open:false}
        anchorOrigin={{vertical: 'top',horizontal: 'right'}}
        TransitionComponent={state.Transition}
        sx={{marginTop:8}}
        key={state.Transition.name}
        onClose={handleCloseSnackBar}
        autoHideDuration={3000}>
          <Alert severity={openSnackBar ? openSnackBar.severity : ''} onClose={handleCloseSnackBar} variant='filled' sx={{width:'100%'}}>
            {/* <AlertTitle>{openSnackBar ? openSnackBar.severity : ''}</AlertTitle> */}
              <strong>{openSnackBar ? openSnackBar.message : ''}</strong>
          </Alert>
      </Snackbar>

      <Router>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/*" element={ <PrivateRoute> <PagesRoutes/> </PrivateRoute>}/>
        </Routes>
      </Router>
      
    </ThemeProvider>
  );
}

export default App;
