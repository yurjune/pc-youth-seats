import axios, { AxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:5000/api',
};
export const client = axios.create(axiosConfig);
