import { DeleteService, GetService, PostService, PutService } from './ServicesAction';

export const GetVehiculosFiltrados = async (pageIndex,pageSize,searchField='',searchValue='') => {
    return GetService(`api/Vehiculo?pageIndex=${pageIndex}&pageSize=${pageSize}&field=${searchField}&value=${searchValue}`);
}

export const AddNewVehicle = async (newVehicle) => {
    return PostService(`api/Vehiculo`,newVehicle);
}

export const EditVehicle = async (vehicle) => {
    return PutService(`api/Vehiculo`,vehicle);
}

export const DeleteVehicle = async (id) => {
    return DeleteService(`api/Vehiculo?id=${id}`);
}
