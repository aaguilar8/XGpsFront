import { GetService, PostService, PutService, DeleteService } from './ServicesAction';


export const GetConfiguracionesPaginadas = async (pageSize,pageIndex) => {
    return GetService(`api/Configuraciones/get_config_paged?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}


export const GuardarConfiguracionHeader = async (nuevaConfig) => {
    return PostService(`api/Configuraciones/add_config_header`,nuevaConfig);
}

export const EditarConfiguracionHeader = async (config) => {
    return PutService(`api/Configuraciones/edit_config_header`,config);
}

export const EliminarConfiguracionHeader = async (config) => {
    return DeleteService(`api/Configuraciones/delete_config_header?id=${config}`);
}


export const GuardarConfiguracionDetail = async (detail) => {
    return PostService(`api/Configuraciones/add_config_detail`,detail);
}

export const EditarConfiguracionDetail = async (detail) => {
    return PutService(`api/Configuraciones/edit_config_detail`,detail);
}

export const EliminarConfiguracionDetail = async (headerId,detailId) => {
    return DeleteService(`api/Configuraciones/delete_config_detail?idHeader=${headerId}&idDetail=${detailId}`);
}

export const GetSettinsgById = async (id, prop='') => {
    return GetService(`api/Configuraciones/get_settings_by_id?id=${id}&prop=${prop}`);
}

