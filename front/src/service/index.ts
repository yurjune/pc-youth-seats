import {
  CancelReservationReqDto,
  CancelReservationResDto,
  GetLastWeekSeatsResDto,
  GetSeatsResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
} from '../shared/models';
import { requests } from './client';

export default {
  getSeats: (): Promise<GetSeatsResDto> => requests.get('/getSeats'),
  getLastWeekSeats: (): Promise<GetLastWeekSeatsResDto> => requests.get('/getLastWeekSeats'),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    requests.put('/makeReservation', { params }),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    requests.put('/cancelReservation', { params }),
};
