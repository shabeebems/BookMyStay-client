import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`,
    withCredentials: true,
});

export const postRequest = (route: string, data: object) => API.post(route, data);
export const getRequest = (route: string) => API.get(route);
export const putRequest = (route: string, data: object) => API.put(route, data);

export const logoutRequest = (route: string) => API.post(route);