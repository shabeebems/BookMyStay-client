import axios from 'axios';
import apiClient from './axiosClient';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`,
    withCredentials: true,
});

export const postRequest = (route: string, data: object) => API.post(route, data);
export const getRequest = (route: string) => API.get(route);
export const putRequest = (route: string, data: object) => API.put(route, data);

export const protectedGetRequest = (route: string) => apiClient.get(route);
export const protectedPostRequest = (route: string, data: object) => apiClient.post(route, data);
export const protectedPutRequest = (route: string, data: object) => apiClient.put(route, data);

export const logoutRequest = (route: string) => API.post(route);