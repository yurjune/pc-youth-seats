import { Request, Response } from 'express';
import { SeatParams, Seats } from './seat.model';
import { Send } from 'express-serve-static-core';

// ref. https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c

interface TypedReq<T> extends Request {
  body: T;
}
interface TypedRes<T> extends Response {
  send: Send<T, this>;
}

type ResWithMessage = {
  ok: boolean;
  message: string;
};

type GetSeatsRes = Seats;
type GetLastWeekSeatsRes = Seats;

type MakeReservationReq = {
  params: SeatParams;
};
type MakeReservationRes = ResWithMessage;

type CancelReservationReq = {
  params: Pick<SeatParams, 'id' | 'line' | 'ignoreIsLate'>;
};
type CancelReservationRes = ResWithMessage & {
  defaultSeatActive: number;
  defaultSeatName: string;
};

export type {
  TypedReq,
  TypedRes,
  GetSeatsRes,
  GetLastWeekSeatsRes,
  MakeReservationReq,
  MakeReservationRes,
  CancelReservationReq,
  CancelReservationRes,
};
