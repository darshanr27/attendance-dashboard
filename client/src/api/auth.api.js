import axiosInstance from "./axiosInstance";

export const loginUser =  (email, password) =>
    axiosInstance.post('/auth/login', { email, password });

export const logoutUser = () => 
    axiosInstance.post('/auth/logout/');