import express, { Request } from 'express';
const app = express();
import fs from 'fs';
const fsp = fs.promises;
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
import {
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

let seatsMode = 'seats(full).json'; // 단계별 좌석 선택 하기 위함
let lateSeatIds: string[] = [];
let absentSeatIds: string[] = [];

// paths
const jsonDirectory = path.join(__dirname, '../json');
const historyDirectory = path.join(__dirname, '../../../seats_history');
const backupDirectory = path.join(__dirname, '../../../seats_backup');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(history());
app.use(express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.set('port', process.env.PORT || 5000);

// 00 00 00 * * 1
// 초 분 시간 일 월 요일  // EC2 인스턴스는 9시간이 늦다 고로 원하는 시간의 -9를 하면 됨
schedule.scheduleJob('00 00 15 * * 0', () => {
  fs.readFile(`${jsonDirectory}/${seatsMode}`, 'utf8', (err, result) => {
    if (err) return console.log('시온채플 좌석 리셋 실패');

    fs.writeFile(`${jsonDirectory}/seats.json`, result, () => {
      lateSeatIds = [];
      absentSeatIds = [];
      console.log('시온채플 좌석 리셋 완료');
    });
  });

  fs.readFile(`${jsonDirectory}/seats.json`, 'utf8', (err, result) => {
    fs.writeFile(`${jsonDirectory}/seats_last_week.json`, result, () => {
      console.log('지난주 좌석 저장 완료');
    });

    fs.writeFile(`${historyDirectory}/seats_${getYearMonthDate()}.json`, result, (err) => {
      if (err) return console.log(`좌석 히스토리 저장 실패`);
      console.log(`좌석 히스토리 저장 완료`);
    });
  });
});

schedule.scheduleJob('00 00 * * * *', () => {
  fs.readFile(`${jsonDirectory}/seats.json`, 'utf8', (err, result) => {
    const { hour } = getKoreanTime();

    fs.writeFile(`${backupDirectory}/seats_backup_${hour}.json`, result, (err) => {
      if (err) return console.log(`좌석 백업 실패`);
    });
  });
});

const expressServer = app.listen(app.get('port'), () => {
  console.log('WebServer Port: ' + app.get('port'));
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(expressServer, { path: '/socket.io' });
io.on('connection', (socket) => {
  socket.on('seatBoxRendered', () => {
    io.emit('lateSeatList', lateSeatIds);
    io.emit('absentSeatList', absentSeatIds);
  });

  socket.on('seatReserved', (data) => {
    io.emit('seatList', data);

    if (!data.ignoreIsLate && checkIsLateReservation()) {
      lateSeatIds.push(data.seatId);
      io.emit('lateSeatList', lateSeatIds);
    }
  });

  socket.on('seatRemoved', (data) => {
    io.emit('seatList', data);

    absentSeatIds = absentSeatIds.filter((id) => id !== data.seatId);
    io.emit('absentSeatList', absentSeatIds);

    if (!data.ignoreIsLate && checkIsLateReservation()) {
      lateSeatIds.push(data.seatId);
      io.emit('lateSeatList', lateSeatIds);
    }
  });

  socket.on('lateSeatRemoved', (data) => {
    lateSeatIds = lateSeatIds.filter((id) => id !== data);
    io.emit('lateSeatList', lateSeatIds);
  });

  socket.on('absentSeatModified', (data) => {
    const absentSeat = absentSeatIds.find((id) => id === data);
    if (absentSeat) {
      absentSeatIds = absentSeatIds.filter((id) => id !== data);
    } else {
      absentSeatIds.push(data);
    }
    io.emit('absentSeatList', absentSeatIds);
  });
});

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/api/getSeats', (req: Request, res: TypedRes<GetSeatsRes>) => {
  const jsonFile = fs.readFileSync(`${jsonDirectory}/seats.json`, 'utf8');
  const jsonData: Seats = JSON.parse(jsonFile);
  res.send(jsonData);
});

app.get('/api/getLastWeekSeats', (req: Request, res: TypedRes<GetLastWeekSeatsRes>) => {
  const jsonFile = fs.readFileSync(`${jsonDirectory}/seats_last_week.json`, 'utf8');
  const jsonData: Seats = JSON.parse(jsonFile);
  res.send(jsonData);
});

app.put('/api/makeReservation', (req: TypedReq<MakeReservationReq>, res: TypedRes<MakeReservationRes>) => {
  if (!checkIsAvailableForReservation()) {
    res.send({ ok: false, message: '예약 가능한 시간대가 아닙니다.' });
    return;
  }

  const params = req.body.params;
  const seatPlace = 'seats.json';

  fs.readFile(`${jsonDirectory}/${seatPlace}`, 'utf8', (err, data) => {
    const showData: Seats = JSON.parse(data);

    for (let i in showData[params.seat]) {
      if (showData[params.seat][i].id === params.seatId) {
        if (showData[params.seat][i].seat_active === 5) {
          res.send({ ok: false, message: '이미 예약된 좌석입니다.' });
          return;
        }

        showData[params.seat][i].pw = params.pw;
        showData[params.seat][i].name = params.name;
        showData[params.seat][i].seat_active = params.seat_active;
      }
    }

    fs.writeFile(`${jsonDirectory}/${seatPlace}`, JSON.stringify(showData), (err) => {
      if (err) {
        res.send({ ok: false, message: 'Something went wrong.' });
        return;
      }

      res.send({ ok: true, message: '예약 되었습니다.' });
      logWithTime(`예약완료: ${params.seatId}, ${params.name}, ${params.pw}`);
    });
  });
});

app.put('/api/cancelReservation', (req: TypedReq<CancelReservationReq>, res: TypedRes<CancelReservationRes>) => {
  const params = req.body.params;
  const seatPlace = 'seats.json';

  fsp
    .readFile(`${jsonDirectory}/${seatsMode}`, 'utf8')
    .then((el) => {
      let parseEl: Seats = JSON.parse(el);
      let defaultSeatActive = 0;
      let defaultSeatName = '';

      for (let i in parseEl[params.seat]) {
        if (parseEl[params.seat][i].id === params.seatId) {
          defaultSeatActive = parseEl[params.seat][i].seat_active;
          defaultSeatName = parseEl[params.seat][i].name;
        }
      }

      return { defaultSeatActive, defaultSeatName };
    })
    .then(({ defaultSeatActive, defaultSeatName }) => {
      fs.readFile(`${jsonDirectory}/${seatPlace}`, 'utf8', (err, data) => {
        const showData = JSON.parse(data);
        for (let i in showData[params.seat]) {
          if (showData[params.seat][i].id === params.seatId) {
            showData[params.seat][i].pw = '';
            showData[params.seat][i].name = defaultSeatName;
            showData[params.seat][i].seat_active = defaultSeatActive;
          }
        }

        fs.writeFile(`${jsonDirectory}/${seatPlace}`, JSON.stringify(showData), (err) => {
          if (err) {
            res.send({ ok: false, message: 'Something went wrong', defaultSeatActive, defaultSeatName });
            return;
          }

          res.send({ ok: true, message: '삭제 되었습니다.', defaultSeatActive, defaultSeatName });
          logWithTime(`삭제완료: ${params.seatId}`);
        });
      });
    });
});
