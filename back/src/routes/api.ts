import express from 'express';
import seatsController from '../controllers/seats.controller';

const router = express.Router();

router.get('/getSeats', seatsController.getSeats);
router.get('/getLastWeekSeats', seatsController.getLastWeekSeats);
router.put('/makeReservation', seatsController.makeReservation);
router.put('/cancelReservation', seatsController.cancelReservation);

export default router;
