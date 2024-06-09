import { DeleteService, GetService, PostService, PutService } from './ServicesAction';

export const GetClientesFiltrados = async (pageIndex,pageSize,searchField='',searchValue='') => {
    return GetService(`api/cliente?pageIndex=${pageIndex}&pageSize=${pageSize}&field=${searchField}&value=${searchValue}`);
}

export const AddNewCliente = async (newCliente) => {
    return PostService(`api/cliente`,newCliente);
}

export const EditCliente = async (cliente) => {
    return PutService(`api/cliente`,cliente);
}

export const DeleteCliente = async (id) => {
    return DeleteService(`api/cliente?id=${id}`);
}