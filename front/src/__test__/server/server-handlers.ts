import { rest } from 'msw';
import seatMock from '../__mocks__/seatMock.json';
import { envMock } from '__test__/__mocks__/envMock';

const baseURL = `${envMock.SERVER_URL}/api`;

const service = {
  getSeats: rest.get(`${baseURL}/getSeats`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(seatMock));
  }),

  makeReservation: rest.put(`${baseURL}/makeReservation`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true, message: '예약 되었습니다.' }));
  }),

  cancelReservation: rest.put(`${baseURL}/cancelReservation`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true, message: '삭제 되었습니다.' }));
  }),
};

const { getSeats, makeReservation, cancelReservation } = service;

const handlers = [getSeats, makeReservation, cancelReservation];

export { service, handlers };
