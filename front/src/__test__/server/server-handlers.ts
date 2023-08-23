import { rest } from 'msw';
import { env } from '@shared/constants';
import seatMock from '../__mocks__/seatMock.json';

const baseURL = `${env.SERVER_URL}/api`;

const service = {
  getSeats: rest.get(`${baseURL}/getSeats`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(seatMock));
  }),

  makeReservation: rest.post(`${baseURL}/makeReservation`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true, message: '예약 되었습니다.' }));
  }),
};

const { getSeats, makeReservation } = service;

const handlers = [getSeats, makeReservation];

export { service, handlers };
