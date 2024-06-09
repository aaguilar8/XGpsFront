import HttpClient from '../services/HttpClient';
import axios from "axios";

const instance = axios.create();
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

export const DeleteService = (url) => {
    return new Promise((resolve, reject) => {       
        HttpClient
            .delete(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                resolve(error.response);
            });
    });
}

export const PutService = (url,config) => {
    return new Promise((resolve, reject) => {
        HttpClient
            .put(url,config)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                resolve(error.response);
            });
    });
}

export const PostService = (url,nuevaConfig) => {
    return new Promise((resolve, reject) => {
        HttpClient
            .post(url,nuevaConfig)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                resolve(error.response);
            });
    });
}

export const GetService = (url) => {
    return new Promise((resolve, reject) => {
        HttpClient
            .get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                resolve(error.response);
            });
    });
}