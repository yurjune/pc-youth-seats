import type { Seats } from '@shared/models/seat.model';
import { getNumberOfSeats } from '@shared/utils/seat';
import { useMemo } from 'react';
import styles from './index.module.scss';

interface ParticipantsProps {
  seats: Seats | undefined;
}

export const Participants = ({ seats }: ParticipantsProps) => {
  const [activeSeatCount, totalSeatCount] = useMemo(() => getNumberOfSeats(seats ?? {}), [seats]);

  return (
    <div className={styles.participants}>
      <span>좌석 현황: </span>
      <strong>{activeSeatCount}</strong>
      <span> / </span>
      <strong>{totalSeatCount}</strong>
    </div>
  );
};
