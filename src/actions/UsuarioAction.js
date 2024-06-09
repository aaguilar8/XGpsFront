import HttpClient from '../services/HttpClient';
import axios from 'axios';
import { types } from '../types/types';

const instance = axios.create();
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

export const registrarUsuario = (usuario) => {
    return new Promise((resolve,reject) => {
        instance
            .post('/api/Usuario/registrar', usuario)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                resolve(error.response);
            });
    });
}

export const loginUsuario = (usuario, dispatch) => {
    return new Promise((resolve, reject) => {
        instance
            .post('/api/usuario/login',usuario)
            .then((response) =>{
                dispatch({
                    type:types.login,
                    usuario:response.data,
                    autenticado: true
                });

                resolve(response);
            })
            .catch((err) => {
                resolve(err.response);
            });
    });
}

export const getUsuario = (dispatch) => {
    return new Promise((resolve, reject) => {
        HttpClient
            .get('/api/usuario')
            .then((response) =>{
                dispatch({
                    type: types.login,
                    usuario: response.data,
                    autenticado: true
                });
                resolve(response);
            })
            .catch((err) => {
                resolve(err.response);
            });
    });
}