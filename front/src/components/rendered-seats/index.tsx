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

export const RenderedSeats = (props: RenderedSeatsProps) => {
  const { seats, lateSeatIds = [], absentSeatIds = [], isAbsentMode = false, isLastWeekMode = false } = props;

  const renderSeats = (seats: Seats | undefined) => {
    if (seats == null) {
      return;
    }

    return Object.keys(seats).map((line, idx) => (
      <div key={idx}>
        <div className={styles.line}>
          {seats[line].map((seat, idx) => {
            if (seat.seat_active === 0) {
              return <div key={idx} className={styles['active-0']} />;
            }

            return (
              <SeatBox
                key={idx}
                seat={seat}
                seatLine={line}
                lateSeatIds={lateSeatIds}
                absentSeatIds={absentSeatIds}
                isAbsentMode={isAbsentMode}
                isLastWeekMode={isLastWeekMode}
              />
            );
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  return <div>{renderSeats(seats)}</div>;
};
