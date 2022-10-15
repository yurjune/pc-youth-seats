import clsx from 'clsx';
import { Seat } from '../../shared/models';
import styles from './index.module.scss';

interface SeatBoxProps extends Seat {
  onClick?: () => void;
}

/**
 * seat-active
 * 0: 복도
 * 1: 회색, 예약 가능 좌석
 * 2: 진한 초록, 예약 불가 좌석
 * 3:
 * 4: 연한 초록, 특수 좌석
 * 5: 파랑, 예약된 좌석
 * 6: 공간만 차지하는 투명 좌석
 */
export const SeatBox = (props: SeatBoxProps) => {
  const cls = clsx(styles.seat, styles[`active-${props.seat_active}`]);
  const isDisabled = props.seat_active === 2 || props.seat_active === 6;

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
