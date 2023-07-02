import { type Seats } from '../../shared/models';
import { SeatBox } from '../seat-box';
import styles from './index.module.scss';

interface RenderedSeatsProps {
  seats: Seats | undefined;
  lateSeatIds?: string[];
  absentSeatIds?: string[];
  isAbsentMode?: boolean;
  isLastWeekMode?: boolean;
}

export const RenderedSeats = ({ seats, ...rest }: RenderedSeatsProps) => {
  const renderSeats = (seats: Seats) => {
    return Object.keys(seats).map((line, idx) => (
      <div key={idx}>
        <div className={styles.line}>
          {seats[line].map((seat, idx) => {
            if (seat.seat_active === 0) {
              return <div key={idx} className={styles['active-0']} />;
            }

            return <SeatBox key={idx} seat={seat} seatLine={line} {...rest} />;
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  return <div className={styles.container}>{seats ? renderSeats(seats) : null}</div>;
};
