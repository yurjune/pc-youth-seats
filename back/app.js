const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const helmet = require('helmet');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const { checkIsAvailableForReservation, checkIsLateReservation } = require('./utils/time');

let seatsMode = 'seats(full).json'; // 단계별 좌석 선택 하기 위함
let lateSeatIds = [];
let absentSeatIds = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.set('port', process.env.PORT || 5000);

// 00 00 00 * * 1
// 초 분 시간 일 월 요일  // EC2 인스턴스는 9시간이 늦다 고로 원하는 시간의 -9를 하면 됨
schedule.scheduleJob('00 00 15 * * 0', () => {
  fs.readFile('./json/seats.json', 'utf8', (err, result) => {
    fs.writeFile('./json/seats_last_week.json', result, (err) => {
      console.log('지난주 좌석 저장 완료');
    });
  });

  fs.readFile(`./json/${seatsMode}`, 'utf8', (err, result) => {
    fs.writeFile('./json/seats.json', result, (err) => {
      if (err) {
        console.log('시온 데이터 리셋 실패');
        return;
      }

      lateSeatIds = [];
      absentSeatIds = [];
      console.log('시온 데이터 리셋 완료');
    });
  });
});

const expressServer = app.listen(app.get('port'), () => {
  console.log('WebServer Port: ' + app.get('port'));
});

const io = require('socket.io')(expressServer, { path: '/socket.io' });
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

app.get('/api/getSeats', (req, res) => {
  const jsonFile = fs.readFileSync('./json/seats.json', 'utf8');
  const jsonData = JSON.parse(jsonFile);
  res.send(jsonData);
});

app.get('/api/getLastWeekSeats', (req, res) => {
  const jsonFile = fs.readFileSync('./json/seats_last_week.json', 'utf8');
  const jsonData = JSON.parse(jsonFile);
  res.send(jsonData);
});

app.post('/api/searchSeat', (req, res) => {
  const { name, pw } = req.body.params;
  const seatPlace = 'seats.json';

  fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
    const showData = JSON.parse(data);
    const lineList = Object.keys(showData);

    for (const line of lineList) {
      const seat = showData[line].find((item) => {
        return item.name === name && item.pw === pw;
      });

      if (seat) {
        res.send(seat.id);
        return;
      }
    }

    res.send(false);
  });
});

app.put('/api/makeReservation', (req, res) => {
  if (!checkIsAvailableForReservation()) {
    res.send({ ok: false, message: '예약 가능한 시간대가 아닙니다.' });
    return;
  }

  const params = req.body.params;
  const seatPlace = 'seats.json';
  fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
    const showData = JSON.parse(data);
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

    fs.writeFile(`./json/${seatPlace}`, JSON.stringify(showData), (err) => {
      if (err) {
        res.send({ ok: false, message: 'Something went wrong.' });
        return;
      }

      res.send({ ok: true, message: '예약 되었습니다.' });
      console.log('JSON FILE 수정 완료');
    });
  });
});

app.put('/api/cancelReservation', (req, res) => {
  const params = req.body.params;
  const seatPlace = 'seats.json';

  fsp
    .readFile(`./json/${seatsMode}`)
    .then((el) => {
      let parseEl = JSON.parse(el);
      let defaultSeatActive = 0;

      for (let i in parseEl[params.seat]) {
        if (parseEl[params.seat][i].id === params.seatId) {
          defaultSeatActive = parseEl[params.seat][i].seat_active;
        }
      }

      return defaultSeatActive;
    })
    .then((defaultSeatActive) => {
      fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
        const showData = JSON.parse(data);
        for (let i in showData[params.seat]) {
          if (showData[params.seat][i].id === params.seatId) {
            showData[params.seat][i].pw = '';
            showData[params.seat][i].name = '';
            showData[params.seat][i].seat_active = defaultSeatActive;
          }
        }

        fs.writeFile(`./json/${seatPlace}`, JSON.stringify(showData), (err) => {
          if (err) {
            res.send({ ok: false, message: 'Something went wrong', defaultSeatActive });
            return;
          }

          res.send({ ok: true, message: '삭제 되었습니다.', defaultSeatActive });
          console.log('JSON FILE 수정 완료');
        });
      });
    });
});
