import { SeatActive, Seats } from '@shared/models/seat.model';
import { SeatBox } from '../seat-box';
import { Spinner } from '../spinner';
import styles from './index.module.scss';

interface RenderedSeatsProps {
  seats: Seats | undefined;
  lateSeatIds?: string[];
  absentSeatIds?: string[];
  isAbsentMode?: boolean;
  isLastWeekMode?: boolean;
}

export const RenderedSeats = ({ seats, ...rest }: RenderedSeatsProps) => {
  if (seats == null) return <Spinner />;

  return (
    <div className={styles.container}>
      {Object.keys(seats).map((line, idx) => (
        <div key={idx}>
          <div className={styles.line}>
            {seats[line].map((seat, idx) => {
              if (seat.seat_active === SeatActive.PATH) {
                return <div key={idx} className={styles['active-0']} />;
              }

              return <SeatBox key={idx} seat={seat} seatLine={line} {...rest} />;
            })}
          </div>
          {line === 'seat_line_6' && <br />}
        </div>
      ))}
    </div>
  );
};
