import { SeatParams } from '../shared/models/seat.model';

export type SearchSeatReqDto = { name: string; pw: string };
export type SearchSeatResDto = string | boolean;

export type MakeReservationReqDto = SeatParams;
export type MakeReservationResDto = {
  ok: boolean;
  message: string;
};

export type CancelReservationReqDto = Omit<SeatParams, 'name' | 'pw' | 'seat_active'>;
export interface CancelReservationResDto {
  ok: boolean;
  message: string;
  defaultSeatActive: number;
}
