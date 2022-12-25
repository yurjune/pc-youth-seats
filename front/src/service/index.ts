import { Seats } from '../shared/models';
import { requests } from './client';
import {
  CancelReservationReqDto,
  CancelReservationResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
  SearchSeatReqDto,
  SearchSeatResDto,
} from './service.dto';

export default {
  getSeats: (): Promise<Seats> => requests.get('/getSeats'),
  getLastWeekSeats: (): Promise<Seats> => requests.get('/getLastWeekSeats'),
  searchSeat: (params: SearchSeatReqDto): Promise<SearchSeatResDto> => requests.post(`/searchSeat`, { params }),

  makeReservation: (params: MakeReservationReqDto): Promise<MakeReservationResDto> =>
    requests.put('/makeReservation', { params }),
  cancelReservation: (params: CancelReservationReqDto): Promise<CancelReservationResDto> =>
    requests.put('/cancelReservation', { params }),
};
