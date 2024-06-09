import { types } from "../../types/types";

export const initialState = {
    usuario:{
        id: '',
        nombre: '',
        apellido: '',
        email: '',
        userNnme: '',
        imagen: ''
    },
    autenticado:false
}

const sesionUsuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.login:
            return{
                ...state,
                usuario: action.usuario,
                autenticado: action.autenticado
            };
        case types.logout:
            return{
                ...state,
                usuario: action.nuevoUsuario,
                autenticado: action.autenticado
            };
        case types.updateUser:
            return{
                ...state,
                usuario: action.nuevoUsuario,
                autenticado: action.autenticado
            };
        default:
            return state;
    }
}

export default sesionUsuarioReducer;