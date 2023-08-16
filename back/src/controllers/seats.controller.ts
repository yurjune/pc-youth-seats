import { RequestHandler } from 'express';
import fs from 'fs';
const fsPromise = fs.promises;
import { checkIsAvailableForReservation, logWithTime } from '../utils';
import type {
  CancelReservationReq,
  CancelReservationRes,
  GetLastWeekSeatsRes,
  GetSeatsRes,
  MakeReservationReq,
  MakeReservationRes,
  Seats,
  TypedReq,
  TypedRes,
} from '../models';
import { CURRENT_SEATS, FULL_SEATS, LAST_WEEK_SEATS, JSON_DIRECTORY } from '../constants';

class SeatsController {
  getSeats: RequestHandler = (_, res: TypedRes<GetSeatsRes>) => {
    const jsonFile = fs.readFileSync(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8');
    const parsedJSON = JSON.parse(jsonFile);
    return res.send(parsedJSON);
  };

  getLastWeekSeats: RequestHandler = (_, res: TypedRes<GetLastWeekSeatsRes>) => {
    const jsonFile = fs.readFileSync(`${JSON_DIRECTORY}/${LAST_WEEK_SEATS}`, 'utf8');
    const parsedJSON = JSON.parse(jsonFile);
    return res.send(parsedJSON);
  };

  makeReservation: RequestHandler = (
    req: TypedReq<MakeReservationReq>,
    res: TypedRes<MakeReservationRes>,
  ) => {
    if (!checkIsAvailableForReservation()) {
      return res.send({ ok: false, message: '예약 가능한 시간대가 아닙니다.' });
    }

    const { params } = req.body;
    fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, data) => {
      const parsedJSON: Seats = JSON.parse(data);

      for (const idx in parsedJSON[params.line]) {
        if (parsedJSON[params.line][idx].id !== params.id) {
          continue;
        }

        if (parsedJSON[params.line][idx].seat_active === 5) {
          return res.send({ ok: false, message: '이미 예약된 좌석입니다.' });
        }

        parsedJSON[params.line][idx].seat_active = params.seat_active;
        parsedJSON[params.line][idx].name = params.name;
        parsedJSON[params.line][idx].pw = params.pw;
        break;
      }

      fs.writeFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, JSON.stringify(parsedJSON), (err) => {
        if (err) {
          return res.send({ ok: false, message: 'Something went wrong.' });
        }

        logWithTime(`예약완료: ${params.id}, ${params.name}, ${params.pw}`);
        return res.send({ ok: true, message: '예약 되었습니다.' });
      });
    });
  };

  cancelReservation: RequestHandler = (
    req: TypedReq<CancelReservationReq>,
    res: TypedRes<CancelReservationRes>,
  ) => {
    const { params } = req.body;
    fsPromise
      .readFile(`${JSON_DIRECTORY}/${FULL_SEATS}`, 'utf8')
      .then((file) => {
        const parsedJSON: Seats = JSON.parse(file);
        let defaultSeatActive = 0;
        let defaultSeatName = '';

        for (const seat of parsedJSON[params.line]) {
          if (seat.id === params.id) {
            defaultSeatActive = seat.seat_active;
            defaultSeatName = seat.name;
            break;
          }
        }

        return { defaultSeatActive, defaultSeatName };
      })
      .then(({ defaultSeatActive, defaultSeatName }) => {
        fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, data) => {
          const parsedJSON: Seats = JSON.parse(data);

          for (const idx in parsedJSON[params.line]) {
            if (parsedJSON[params.line][idx].id === params.id) {
              parsedJSON[params.line][idx].seat_active = defaultSeatActive;
              parsedJSON[params.line][idx].name = defaultSeatName;
              parsedJSON[params.line][idx].pw = '';
              break;
            }
          }

          fs.writeFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, JSON.stringify(parsedJSON), (err) => {
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
  };
}

export default new SeatsController();
