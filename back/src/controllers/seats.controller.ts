import { NextFunction, RequestHandler } from 'express';
import fs from 'fs';
import { CURRENT_SEATS, JSON_DIRECTORY, LAST_WEEK_SEATS, ORIGIN_SEATS } from '../constants';
import type {
  CancelReservationReq,
  CancelReservationRes,
  GetLastWeekSeatsRes,
  GetSeatsRes,
  MakeReservationReq,
  MakeReservationRes,
  TypedReq,
  TypedRes,
} from '../models/router.model';
import type { Seats } from '../models/seat.model';
import { checkIsAvailableForReservation } from '../utils/time';

const fsPromise = fs.promises;

class SeatsController {
  getSeats: RequestHandler = (_, res: TypedRes<GetSeatsRes>) => {
    try {
      const jsonFile = fs.readFileSync(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8');
      const parsedJSON = JSON.parse(jsonFile);
      return res.send(parsedJSON);
    } catch (err) {
      return res.sendStatus(500);
    }
  };

  getLastWeekSeats: RequestHandler = (_, res: TypedRes<GetLastWeekSeatsRes>) => {
    try {
      const jsonFile = fs.readFileSync(`${JSON_DIRECTORY}/${LAST_WEEK_SEATS}`, 'utf8');
      const parsedJSON = JSON.parse(jsonFile);
      return res.send(parsedJSON);
    } catch (err) {
      return res.sendStatus(500);
    }
  };

  makeReservation: RequestHandler = (
    req: TypedReq<MakeReservationReq>,
    res: TypedRes<MakeReservationRes>,
    next: NextFunction,
  ) => {
    if (!checkIsAvailableForReservation()) {
      return res.send({ ok: false, message: '매주 월요일 오후 9시부터 예약 가능합니다.' });
    }

    const { params } = req.body;
    fs.readFile(`${JSON_DIRECTORY}/${CURRENT_SEATS}`, 'utf8', (err, data) => {
      if (err) return res.sendStatus(500);

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
        if (err) return res.sendStatus(500);

        res.send({ ok: true, message: '예약 되었습니다.' });
        next();
      });
    });
  };

  cancelReservation: RequestHandler = (
    req: TypedReq<CancelReservationReq>,
    res: TypedRes<CancelReservationRes>,
    next: NextFunction,
  ) => {
    const { params } = req.body;
    fsPromise
      .readFile(`${JSON_DIRECTORY}/${ORIGIN_SEATS}`, 'utf8')
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
          if (err) return res.sendStatus(500);

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
            if (err) return res.sendStatus(500);

            res.send({
              ok: true,
              message: '삭제 되었습니다.',
              defaultSeatActive,
              defaultSeatName,
            });
            next();
          });
        });
      })
      .catch(() => {
        return res.sendStatus(500);
      });
  };
}

export default new SeatsController();
