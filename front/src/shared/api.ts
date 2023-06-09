import {
  CancelReservationReqDto,
  CancelReservationResDto,
  GetLastWeekSeatsResDto,
  GetSeatsResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
} from './models';
import axios, { AxiosRequestConfig } from 'axios';
import { env } from './constants';

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${env.SERVER_URL}/api`,
};
const client = axios.create(axiosConfig);

const requests = {
  get: <T>(url: string) => client.get<T>(url).then((response) => response.data),
  post: <T, U>(url: string, body: T) => client.post<U>(url, body).then((response) => response.data),
  put: <T, U>(url: string, body: T) => client.put<U>(url, body).then((response) => response.data),
};

const api = {
  getSeats: (): Promise<GetSeatsResDto> => requests.get('/getSeats'),
  getLastWeekSeats: (): Promise<GetLastWeekSeatsResDto> => requests.get('/getLastWeekSeats'),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    requests.put('/makeReservation', { params }),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    requests.put('/cancelReservation', { params }),
};

export default api;
