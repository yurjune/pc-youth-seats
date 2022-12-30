import { Seats } from '../shared/models';
import { requests } from './client';
import {
  CancelReservationReqDto,
  CancelReservationResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
} from './service.dto';

export default {
  getSeats: (): Promise<Seats> => requests.get('/getSeats'),
  getLastWeekSeats: (): Promise<Seats> => requests.get('/getLastWeekSeats'),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    requests.put('/makeReservation', { params }),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    requests.put('/cancelReservation', { params }),
};
