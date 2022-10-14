const express = require('express');
const http = require('http');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const helmet = require('helmet');
const moment = require('moment');

let seatsMode = 'seats(50%).json'; // 단계별 좌석 선택 하기 위함
let scheduleTime = '00 00 15 * * 0';
let ableReserveDay = 1;
let ableReserveTime = 21;

// Post 방식은 Get 과 다르기 때문에 body-parser 를 설치해서 사용해야한다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('connect-history-api-fallback')());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.set('port', process.env.PORT || 5000);

// 00 00 00 * * 1
// 초 분 시간 일 월 요일  // EC2 인스턴스는 9시간이 늦다 고로 원하는 시간의 -9를 하면 됨
schedule.scheduleJob('00 00 15 * * 0', () => {
  fs.readFile('./json/' + seatsMode, 'utf8', (err, result) => {
    console.log('seatsMode :', seatsMode);
    fs.writeFile('./json/seats.json', result, (err) => {
      if (err) {
        console.log('시온 데이터 리셋 실패');
      } else {
        console.log('시온 데이터 리셋 완료');
        console.log('현재 모드는? :', seatsMode);
      }
    });
  });
  fs.readFile('./json/seats_cana_origin.json', 'utf8', (err, result) => {
    fs.writeFile('./json/seats_cana.json', result, (err) => {
      if (err) {
        console.log('가나홀 데이터 리셋 실패');
      } else {
        console.log('가나홀 데이터 리셋 완료');
      }
    });
  });
});

const expressServer = app.listen(app.get('port'), () => {
  console.log('WebServer Port: ' + app.get('port'));
});

const io = require('socket.io')(expressServer, { path: '/socket.io' });
io.on('connection', (socket) => {
  console.log('connect from client: ' + socket);

  socket.on('chat', (data) => {
    console.log('message from client: ' + data);
    io.emit('chat', 'from backend');
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

app.get('/api/getSeatsCana', (req, res) => {
  const jsonFile = fs.readFileSync('./json/seats_cana.json', 'utf8');
  const jsonData = JSON.parse(jsonFile);
  res.send(jsonData);
});

app.get('/api/getReserveAbleFlag', (req, res) => {
  let getTime = moment().add(9, 'h').format('HH');
  let getDay = moment().add(9, 'h').day();
  // let getTime = moment().format('HH');
  // let getDay = moment().day();
  if (getDay == ableReserveDay && getTime < ableReserveTime) {
    res.send(false);
  } else {
    let getTime1 = moment().add(9, 'h').format('HH-mm-ss');
    res.send({ getTime1 });
  }
});

app.get('/api/getCurrentableReserveTime', (req, res) => {
  res.send({ ableReserveDay, ableReserveTime });
});

app.post('/api/setCurrentableReserveTime', (req, res) => {
  ableReserveDay = req.body.params.day;
  ableReserveTime = req.body.params.time;
  res.send(true);
});

app.put('/api/seatsModifyAdmin', (req, res) => {
  let params = req.body.params;
  let seatPlace = params.seatPlace === 'xion' ? 'seats.json' : 'seats_cana.json';
  fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
    let parsedSeat = JSON.parse(data);
    for (let i in parsedSeat[params.seat]) {
      if (parsedSeat[params.seat][i].id === params.seatId) {
        parsedSeat[params.seat][i].pw = params.pw;
        parsedSeat[params.seat][i].name = params.name;
        parsedSeat[params.seat][i].seat_active = params.seat_active;
      }
    }

    fs.writeFile(`./json/${seatPlace}`, JSON.stringify(parsedSeat), (err) => {
      if (err) {
        res.send(false);
      } else {
        console.log('JSON 파일 수정 완료');
        fs.readFile(`./json/${seatsMode}`, 'utf8', (err, data) => {
          let parsedSeat = JSON.parse(data);
          for (let i in parsedSeat[params.seat]) {
            if (parsedSeat[params.seat][i].id === params.seatId) {
              parsedSeat[params.seat][i].pw = params.pw;
              parsedSeat[params.seat][i].name = params.name;
              parsedSeat[params.seat][i].seat_active = params.seat_active;
            }
          }
          fs.writeFile(`./json/${seatsMode}`, JSON.stringify(parsedSeat), (err) => {
            if (err) {
              res.send(false);
            } else {
              res.send(true);
              console.log('현재 JSON FILE 수정 완료');
            }
          });
        });
      }
    });
  });
});

app.put('/api/seatsModify', (req, res) => {
  let getTime = moment().add(9, 'h').format('HH');
  let getDay = moment().add(9, 'h').day();
  // let getTime = moment().format('HH');
  // let getDay = moment().day();
  if (getDay == ableReserveDay && getTime < ableReserveTime) {
    res.send({ negative: '예약 가능한 시간대가 아닙니다.' });
  } else {
    let params = req.body.params;
    let seatPlace = params.seatPlace === 'xion' ? 'seats.json' : 'seats_cana.json';
    fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
      let showData = JSON.parse(data);
      for (let i in showData[params.seat]) {
        if (showData[params.seat][i].id === params.seatId) {
          if (showData[params.seat][i].seat_active === 5 && !params.delFlag) {
            res.send({ reserved: true });
            return;
          } else {
            showData[params.seat][i].pw = params.pw;
            showData[params.seat][i].name = params.name;
            showData[params.seat][i].seat_active = params.seat_active;
          }
        }
      }
      fs.writeFile(`./json/${seatPlace}`, JSON.stringify(showData), (err) => {
        if (err) {
          res.send(false);
        } else {
          res.send(true);
          console.log('JSON FILE 수정 완료');
        }
      });
    });
  }
});

app.put('/api/deleteSeatsReservation', (req, res) => {
  let params = req.body.params;
  let seatPlace = params.seatPlace === 'xion' ? 'seats.json' : 'seats_cana.json';
  fsp
    .readFile(`./json/${seatsMode}`)
    .then((el) => {
      let parseEl = JSON.parse(el);
      let orgSeatActive = 0;
      for (let i in parseEl[params.seat]) {
        if (parseEl[params.seat][i].id === params.seatId) {
          orgSeatActive = parseEl[params.seat][i].seat_active;
        }
      }
      return orgSeatActive;
    })
    .then((orgActive) => {
      fs.readFile(`./json/${seatPlace}`, 'utf8', (err, data) => {
        let showData = JSON.parse(data);
        for (let i in showData[params.seat]) {
          if (showData[params.seat][i].id === params.seatId) {
            showData[params.seat][i].pw = params.pw;
            showData[params.seat][i].name = params.name;
            showData[params.seat][i].seat_active = orgActive;
          }
        }
        let result = { orgActive };
        fs.writeFile(`./json/${seatPlace}`, JSON.stringify(showData), (err) => {
          if (err) {
            res.send({ ...result, resFlag: false });
          } else {
            res.send({ ...result, resFlag: true });
            console.log('JSON FILE 수정 완료');
          }
        });
      });
    });
});

app.post('/api/seatsChange', (req, res) => {
  let step = req.body.params.step;
  let seatPlace = step === '40' ? 'seats_cana.json' : 'seats.json';
  console.log('선택한 단계:' + step, seatPlace);
  if (!step) return res.send(false);
  if (step === '40') {
    seatsMode = 'seats_cana_origin.json';
  } else {
    seatsMode = `seats(${step}%).json`;
  }

  fs.readFile('./json/' + seatsMode, 'utf8', (err, result) => {
    fs.writeFile(`./json/${seatPlace}`, result, (err) => {
      if (err) {
        return res.send(false);
      } else {
        console.log('JSON FILE 수정 완료');
      }
    });
  });

  const jsonFile = fs.readFileSync(`./json/${seatPlace}`, 'utf8');
  const jsonData = JSON.parse(jsonFile);
  res.send(jsonData);
});
