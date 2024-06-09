import { DeleteService, GetService, PostService, PutService } from './ServicesAction';

export const GetEquiposFiltrados = async (pageIndex,pageSize,searchField='',searchValue='') => {
    return GetService(`api/Equipo?pageIndex=${pageIndex}&pageSize=${pageSize}&field=${searchField}&value=${searchValue}`);
}

export const AddNewEquipo = async (newEquipo) => {
    return PostService(`api/Equipo`,newEquipo);
}

export const EditEquipo = async (equipo) => {
    return PutService(`api/Equipo`,equipo);
}

export const DeleteEquipo = async (id) => {
    return DeleteService(`api/Equipo?id=${id}`);
}