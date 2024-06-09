import sesionUsuarioReducer from './sesionUsuarioReducer';
import openSnackBarReducer from './openSnackBarReducer';

export const mainReducer = ({sesionUsuario,openSnackBar},action) => {
    return {
        sesionUsuario: sesionUsuarioReducer(sesionUsuario, action),
        openSnackBar: openSnackBarReducer(openSnackBar, action)
    }
}

