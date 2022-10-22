import { SeatParams, Seats } from '../shared/models';
import { requests } from './client';

export default {
  getSeats: (): Promise<Seats> => requests.get('/getSeats'),

  seatsModify: (params: SeatParams): Promise<any> => requests.put('/seatsModify', { params }),

  deleteSeatsReservation: (params: Omit<SeatParams, 'name' | 'pw' | 'seat_active'>): Promise<any> =>
    requests.put('/deleteSeatsReservation', { params }),
};
