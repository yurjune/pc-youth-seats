import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import schedule from 'node-schedule';
import helmet from 'helmet';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import { Server } from 'socket.io';

import { checkIsLateReservation, getYearMonthDate, getKoreanTime } from './utils';
import type { ClientToServerEvents, ServerToClientEvents } from './models';
import { cancelReservation, getLastWeekSeats, getSeats, makeReservation } from './controllers';
import {
  CURRENT_SEATS,
  FULL_SEATS,
  LAST_WEEK_SEATS,
  BACKUP_DIRECTORY,
  HISTORY_DIRECTORY,
  JSON_DIRECTORY,
} from './constants';

const app = express();
let lateSeatIds: string[] = [];
let absentSeatIds: string[] = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(history());
app.use(express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.set('port', process.env.PORT || 5000);

// 초 분 시간 일 월 요일
// 월요일 자정에 초기화
schedule.scheduleJob('00 00 00 * * 1', () => {
  fs.readFile(`${JSON_DIRECTORY}/${FULL_SEATS}`, 'utf8', (err, result) => {
    if (err) return console.log('시온채플 좌석 리셋 실패');

    fs.writeFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, result, () => {
      lateSeatIds = [];
      absentSeatIds = [];
      console.log('시온채플 좌석 리셋 완료');
    });
  });

  fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    fs.writeFile(`${JSON_DIRECTORY}/${LAST_WEEK_SEATS}`, result, () => {
      console.log('지난주 좌석 저장 완료');
    });

    fs.writeFile(`${HISTORY_DIRECTORY}/seats_${getYearMonthDate()}.json`, result, (err) => {
      if (err) return console.log(`좌석 히스토리 저장 실패`);
      console.log(`좌석 히스토리 저장 완료`);
    });
  });
});

schedule.scheduleJob('00 00 * * * *', () => {
  fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    const { hour } = getKoreanTime();

    fs.writeFile(`${BACKUP_DIRECTORY}/seats_backup_${hour}.json`, result, (err) => {
      if (err) return console.log(`좌석 백업 실패`);
    });
  });
});

const expressServer = app.listen(app.get('port'), () => {
  console.log('WebServer Port: ' + app.get('port'));
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer, {
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
    absentSeatIds = isAbsent ? absentSeatIds.filter((id) => id !== data) : [...absentSeatIds, data];
    io.emit('absentSeatList', absentSeatIds);
  });
});

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/api/getSeats', getSeats);
app.get('/api/getLastWeekSeats', getLastWeekSeats);
app.put('/api/makeReservation', makeReservation);
app.put('/api/cancelReservation', cancelReservation);
