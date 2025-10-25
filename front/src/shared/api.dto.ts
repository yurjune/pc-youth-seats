import { SeatParams, Seats } from './models/seat.model';

type ResWithMessage = {
  ok: boolean;
  message: string;
};

type GetSeatsResDto = Seats;
type GetLastWeekSeatsResDto = Seats;

type MakeReservationReqDto = SeatParams;
type MakeReservationResDto = ResWithMessage;

type CancelReservationReqDto = Pick<SeatParams, 'id' | 'line' | 'ignoreIsLate'>;
type CancelReservationResDto = ResWithMessage & {
  defaultSeatActive: number;
  defaultSeatGroup: string;
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
