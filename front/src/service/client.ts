import axios, { AxiosRequestConfig } from 'axios';
import { SERVER_URL } from '../shared/constants';

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${SERVER_URL}/api`,
};
const client = axios.create(axiosConfig);

export const requests = {
  get: <T>(url: string) => client.get<T>(url).then((response) => response.data),
  put: <T, U>(url: string, body: T) => client.put<U>(url, body).then((response) => response.data),
};
