import express from 'express';
import seatsController from '../controllers/seats.controller';
import { logSeatChange } from '../middlewares';

const router = express.Router();

router.get('/getSeats', seatsController.getSeats);
router.get('/getLastWeekSeats', seatsController.getLastWeekSeats);
router.put('/makeReservation', seatsController.makeReservation, logSeatChange);
router.put('/cancelReservation', seatsController.cancelReservation, logSeatChange);

export default router;
