import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { ClientToServerEvents, ServerToClientEvents } from './models';
import { checkIsLateReservation } from './utils';

const launchSocketIO = (expressServer: Server) => {
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(expressServer, {
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    socket.on('showLateSeats', () => {
      io.emit('lateSeatList', lateSeatIds);
    });

    socket.on('showAbsentSeats', () => {
      io.emit('absentSeatList', absentSeatIds);
    });

    socket.on('seatReserved', (data) => {
      io.emit('seatList', data);

      absentSeatIds = absentSeatIds.filter((id) => id !== data.id);
      io.emit('absentSeatList', absentSeatIds);

      if (!data.ignoreIsLate && checkIsLateReservation()) {
        lateSeatIds.push(data.id);
        io.emit('lateSeatList', lateSeatIds);
      }
    });

    socket.on('seatRemoved', (data) => {
      io.emit('seatList', data);

      absentSeatIds = absentSeatIds.filter((id) => id !== data.id);
      io.emit('absentSeatList', absentSeatIds);

      if (!data.ignoreIsLate && checkIsLateReservation()) {
        lateSeatIds.push(data.id);
        io.emit('lateSeatList', lateSeatIds);
      }
    });

    socket.on('lateSeatRemoved', (data) => {
      lateSeatIds = lateSeatIds.filter((id) => id !== data);
      io.emit('lateSeatList', lateSeatIds);
    });

    socket.on('absentSeatModified', (data) => {
      const isAbsent = absentSeatIds.some((id) => id === data);
      absentSeatIds = isAbsent
        ? absentSeatIds.filter((id) => id !== data)
        : [...absentSeatIds, data];
      io.emit('absentSeatList', absentSeatIds);
    });
  });
};

export default launchSocketIO;
