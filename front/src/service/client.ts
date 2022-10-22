import axios, { AxiosRequestConfig } from 'axios';
import { Seats } from '../shared/models';
import { SERVER_URL } from '../shared/constants';

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${SERVER_URL}/api`,
};
const client = axios.create(axiosConfig);

export const requests = {
  get: (url: string) => client.get<Seats>(url).then((response) => response.data),
  post: <T>(url: string, body: T) => client.post(url, body).then((response) => response.data),
  put: <T>(url: string, body: T) => client.put(url, body).then((response) => response.data),
  delete: (url: string) => client.delete(url).then((response) => response.data),
};
