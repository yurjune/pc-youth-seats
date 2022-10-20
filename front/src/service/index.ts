import { SeatParam, Seats } from '../shared/models';
import { requests } from './client';

export default {
  getSeats: (): Promise<Seats> =>
    requests
      .get('/getSeats')
      .then((data) => data)
      .catch((error) => {
        console.error(error);
        return error;
      }),

  seatsModify: (body: SeatParam): Promise<Seats> =>
    requests
      .put('/seatsModify', body)
      .then((data) => data)
      .catch((error) => {
        console.error(error);
        return error;
      }),
};
