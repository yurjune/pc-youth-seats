import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Seats } from '../../shared/models';
import { getNumberOfSeats } from '../../shared/utils';

interface ParticipantsProps {
  seats: Seats | undefined;
}

export const Participants = ({ seats }: ParticipantsProps) => {
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);

  return (
    <div className={styles.participants}>
      <span>좌석 현황: </span>
      <strong>{activeSeats}</strong>
      <span> / </span>
      <strong>{totalSeats}</strong>
    </div>
  );
};
