import { SeatParams, Seats } from './seat.model';

type ResWithMessage = {
  ok: boolean;
  message: string;
};

type GetSeatsResDto = Seats;
type GetLastWeekSeatsResDto = Seats;

type MakeReservationReqDto = SeatParams;
type MakeReservationResDto = ResWithMessage;

type CancelReservationReqDto = Pick<SeatParams, 'seat' | 'seatId' | 'ignoreIsLate'>;
type CancelReservationResDto = ResWithMessage & {
  defaultSeatActive: number;
  defaultSeatName: string;
};

export type {
  GetSeatsResDto,
  GetLastWeekSeatsResDto,
  MakeReservationReqDto,
  MakeReservationResDto,
  CancelReservationReqDto,
  CancelReservationResDto,
};
