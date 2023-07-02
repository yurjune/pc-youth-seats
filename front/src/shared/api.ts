import {
  CancelReservationReqDto,
  CancelReservationResDto,
  GetLastWeekSeatsResDto,
  GetSeatsResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
} from './api.dto';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { env } from './constants';

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${env.SERVER_URL}/api`,
};
const client = axios.create(axiosConfig);
const responseBody = (response: AxiosResponse) => response.data;

const api = {
  getSeats: (): Promise<GetSeatsResDto> => client.get('/getSeats').then(responseBody),
  getLastWeekSeats: (): Promise<GetLastWeekSeatsResDto> =>
    client.get('/getLastWeekSeats').then(responseBody),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    client.put('/makeReservation', { params }).then(responseBody),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    client.put('/cancelReservation', { params }).then(responseBody),
};

export default api;
