import clsx from 'clsx';
import React from 'react';
import { Seat } from '../../shared/models/seat.model';
import styles from './index.module.scss';

interface SeatBoxProps extends Seat {
  onClick?: () => void;
}

export const SeatBox = (props: SeatBoxProps) => {
  const cls = clsx(styles.seat, styles[`active-${props.seat_active}`]);
  const isDisabled = props.seat_active === 2;

  return (
    <div className={cls} onClick={props.onClick}>
      {!isDisabled && (
        <>
          {props.id}
          <br />
          {props.name}
        </>
      )}
    </div>
  );
};
