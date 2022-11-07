import { SeatParams } from './seat.model';

// ref. https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  chat: (arg: SeatParams) => void;
  lateSeatList: (arg: string[]) => void;
}

export interface ClientToServerEvents {
  chat: (arg: SeatParams) => void;
  seatBoxRendered: () => void;
  lateSeatRemoved: (arg: string) => void;
}
