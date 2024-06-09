import { DeleteService, GetService, PostService, PutService } from './ServicesAction';

export const GetPlanesFiltrados = async (pageIndex,pageSize,searchField='',searchValue='') => {
    return GetService(`api/Plan?pageIndex=${pageIndex}&pageSize=${pageSize}&field=${searchField}&value=${searchValue}`);
}

export const AddNewPlan = async (newPlan) => {
    return PostService(`api/Plan`,newPlan);
}

export const EditPlan = async (plan) => {
    return PutService(`api/Plan`,plan);
}

export const DeletePlan = async (id) => {
    return DeleteService(`api/Plan?id=${id}`);
}