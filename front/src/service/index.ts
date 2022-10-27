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
  getReserveAbleFlag: (): Promise<boolean> => requests.get('/getReserveAbleFlag'),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    requests.put('/makeReservation', { params }),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    requests.put('/cancelReservation', { params }),
};
