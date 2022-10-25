import { SeatParams, Seats } from '../shared/models';
import { requests } from './client';

export default {
  getSeats: (): Promise<Seats> => requests.get('/getSeats'),

  makeReservation: (params: SeatParams): Promise<any> => requests.put('/makeReservation', { params }),

  cancelReservation: (params: Omit<SeatParams, 'name' | 'pw' | 'seat_active'>): Promise<any> =>
    requests.put('/cancelReservation', { params }),
};
