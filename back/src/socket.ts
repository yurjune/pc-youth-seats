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
      io.emit('lateSeatList', global.lateSeatIds);
    });

    socket.on('showAbsentSeats', () => {
      io.emit('absentSeatList', global.absentSeatIds);
    });

    socket.on('seatReserved', (data) => {
      io.emit('seatList', data);

      global.absentSeatIds = global.absentSeatIds.filter((id) => id !== data.id);
      io.emit('absentSeatList', global.absentSeatIds);

      if (!data.ignoreIsLate && checkIsLateReservation()) {
        global.lateSeatIds.push(data.id);
        io.emit('lateSeatList', global.lateSeatIds);
      }
    });

    socket.on('seatRemoved', (data) => {
      io.emit('seatList', data);

      global.absentSeatIds = global.absentSeatIds.filter((id) => id !== data.id);
      io.emit('absentSeatList', global.absentSeatIds);

      if (!data.ignoreIsLate && checkIsLateReservation()) {
        global.lateSeatIds.push(data.id);
        io.emit('lateSeatList', global.lateSeatIds);
      }
    });

    socket.on('lateSeatRemoved', (data) => {
      global.lateSeatIds = global.lateSeatIds.filter((id) => id !== data);
      io.emit('lateSeatList', global.lateSeatIds);
    });

    socket.on('absentSeatModified', (data) => {
      const isAbsent = global.absentSeatIds.some((id) => id === data);
      global.absentSeatIds = isAbsent
        ? global.absentSeatIds.filter((id) => id !== data)
        : [...global.absentSeatIds, data];
      io.emit('absentSeatList', global.absentSeatIds);
    });
  });
};

export default launchSocketIO;
