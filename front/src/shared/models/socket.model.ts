import { SeatParams } from './seat.model';

// ref. https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  seatList: (arg: SeatParams) => void;
  lateSeatList: (arg: string[]) => void;
  absentSeatList: (arg: string[]) => void;
}

export interface ClientToServerEvents {
  seatBoxRendered: () => void;
  seatReserved: (arg: SeatParams) => void;
  seatRemoved: (arg: SeatParams) => void;
  lateSeatRemoved: (arg: string) => void;
  absentSeatModified: (arg: string) => void;
}
