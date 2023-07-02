import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import schedule from 'node-schedule';
import helmet from 'helmet';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import { Server } from 'socket.io';

import {
  checkIsAvailableForReservation,
  checkIsLateReservation,
  getYearMonthDate,
  getKoreanTime,
  logWithTime,
} from './utils';
import type {
  CancelReservationReq,
  CancelReservationRes,
  ClientToServerEvents,
  GetLastWeekSeatsRes,
  GetSeatsRes,
  MakeReservationReq,
  MakeReservationRes,
  Seats,
  ServerToClientEvents,
  TypedReq,
  TypedRes,
} from './models';

const app = express();
const fsPromise = fs.promises;
let lateSeatIds: string[] = [];
let absentSeatIds: string[] = [];

// paths
const jsonDirectory = path.join(__dirname, '../json');
const historyDirectory = path.join(__dirname, '../../../seats_history');
const backupDirectory = path.join(__dirname, '../../../seats_backup');
const FULL_SEATS = 'seats(full).json';
const CURRENT_SEATS = 'seats.json';
const LAST_WEEK_SEATS = 'seats_last_week.json';

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
  fs.readFile(`${jsonDirectory}/${FULL_SEATS}`, 'utf8', (err, result) => {
    if (err) return console.log('시온채플 좌석 리셋 실패');

    fs.writeFile(`${jsonDirectory}/${CURRENT_SEATS}`, result, () => {
      lateSeatIds = [];
      absentSeatIds = [];
      console.log('시온채플 좌석 리셋 완료');
    });
  });

  fs.readFile(`${jsonDirectory}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    fs.writeFile(`${jsonDirectory}/${LAST_WEEK_SEATS}`, result, () => {
      console.log('지난주 좌석 저장 완료');
    });

    fs.writeFile(`${historyDirectory}/seats_${getYearMonthDate()}.json`, result, (err) => {
      if (err) return console.log(`좌석 히스토리 저장 실패`);
      console.log(`좌석 히스토리 저장 완료`);
    });
  });
});

schedule.scheduleJob('00 00 * * * *', () => {
  fs.readFile(`${jsonDirectory}/${CURRENT_SEATS}`, 'utf8', (err, result) => {
    const { hour } = getKoreanTime();

    fs.writeFile(`${backupDirectory}/seats_backup_${hour}.json`, result, (err) => {
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

app.get('/api/getSeats', (_, res: TypedRes<GetSeatsRes>) => {
  const jsonFile = fs.readFileSync(`${jsonDirectory}/${CURRENT_SEATS}`, 'utf8');
  const parsedJSON = JSON.parse(jsonFile);
  return res.send(parsedJSON);
});

app.get('/api/getLastWeekSeats', (_, res: TypedRes<GetLastWeekSeatsRes>) => {
  const jsonFile = fs.readFileSync(`${jsonDirectory}/${LAST_WEEK_SEATS}`, 'utf8');
  const parsedJSON = JSON.parse(jsonFile);
  return res.send(parsedJSON);
});

app.put(
  '/api/makeReservation',
  (req: TypedReq<MakeReservationReq>, res: TypedRes<MakeReservationRes>) => {
    if (!checkIsAvailableForReservation()) {
      return res.send({ ok: false, message: '예약 가능한 시간대가 아닙니다.' });
    }

    const { params } = req.body;
    fs.readFile(`${jsonDirectory}/${CURRENT_SEATS}`, 'utf8', (err, data) => {
      const showData: Seats = JSON.parse(data);

      for (let i in showData[params.line]) {
        if (showData[params.line][i].id === params.id) {
          if (showData[params.line][i].seat_active === 5) {
            return res.send({ ok: false, message: '이미 예약된 좌석입니다.' });
          }

          showData[params.line][i].seat_active = params.seat_active;
          showData[params.line][i].name = params.name;
          showData[params.line][i].pw = params.pw;
        }
      }

      fs.writeFile(`${jsonDirectory}/${CURRENT_SEATS}`, JSON.stringify(showData), (err) => {
        if (err) {
          return res.send({ ok: false, message: 'Something went wrong.' });
        }

        logWithTime(`예약완료: ${params.id}, ${params.name}, ${params.pw}`);
        return res.send({ ok: true, message: '예약 되었습니다.' });
      });
    });
  },
);

app.put(
  '/api/cancelReservation',
  (req: TypedReq<CancelReservationReq>, res: TypedRes<CancelReservationRes>) => {
    const { params } = req.body;
    fsPromise
      .readFile(`${jsonDirectory}/${FULL_SEATS}`, 'utf8')
      .then((file) => {
        const parsedJSON: Seats = JSON.parse(file);
        let defaultSeatActive = 0;
        let defaultSeatName = '';

        for (let i in parsedJSON[params.line]) {
          if (parsedJSON[params.line][i].id === params.id) {
            defaultSeatActive = parsedJSON[params.line][i].seat_active;
            defaultSeatName = parsedJSON[params.line][i].name;
          }
        }

        return { defaultSeatActive, defaultSeatName };
      })
      .then(({ defaultSeatActive, defaultSeatName }) => {
        fs.readFile(`${jsonDirectory}/${CURRENT_SEATS}`, 'utf8', (err, data) => {
          const parsedJSON: Seats = JSON.parse(data);

          for (let i in parsedJSON[params.line]) {
            if (parsedJSON[params.line][i].id === params.id) {
              parsedJSON[params.line][i].seat_active = defaultSeatActive;
              parsedJSON[params.line][i].name = defaultSeatName;
              parsedJSON[params.line][i].pw = '';
            }
          }

          fs.writeFile(`${jsonDirectory}/${CURRENT_SEATS}`, JSON.stringify(parsedJSON), (err) => {
            if (err) {
              return res.send({
                ok: false,
                message: 'Something went wrong',
                defaultSeatActive,
                defaultSeatName,
              });
            }

            logWithTime(`삭제완료: ${params.id}`);
            return res.send({
              ok: true,
              message: '삭제 되었습니다.',
              defaultSeatActive,
              defaultSeatName,
            });
          });
        });
      });
  },
);
