import { useMode } from '@shared/hooks';
import type { Seat } from '@shared/models';
import socket from '@shared/socket';
import { checkIsAvailableForReservation, reportErrorMessage } from '@shared/utils';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import styles from './index.module.scss';
import { useDialog } from './useDialog';

interface SeatBoxProps {
  seat: Seat;
  seatLine: string;
  lateSeatIds?: string[];
  absentSeatIds?: string[];
  isAbsentMode?: boolean;
  isLastWeekMode?: boolean;
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
  const {
    seat,
    seatLine,
    lateSeatIds = [],
    absentSeatIds = [],
    isAbsentMode = false,
    isLastWeekMode = false,
  } = props;
  const { isUserMode, isAttendanceMode } = useMode();
  const { openDialog } = useDialog();

  const { seat_active, id, name } = seat;
  const isLate = isAttendanceMode && lateSeatIds.includes(seat.id);
  const isAbsent = !isLate && !isUserMode && absentSeatIds.includes(seat.id);

  const handleSeatClick = async () => {
    if (isLastWeekMode) {
      return;
    }

    if (!checkIsAvailableForReservation()) {
      const message = '예약 가능한 시간대가 아닙니다.';
      toast.error(message, { id: message });
      return;
    }

    try {
      if (isLate) {
        socket.emit('lateSeatRemoved', seat.id);
        return;
      }

      if (isAbsentMode) {
        socket.emit('absentSeatModified', seat.id);
        return;
      }
    } catch (error) {
      reportErrorMessage(error);
    }

    openDialog(seat, seatLine);
  };

  const cls = clsx(styles.seat, {
    [styles[`active-${seat_active}`]]: isLastWeekMode || (!isLate && !isAbsent),
    [styles.lastWeek]: isLastWeekMode,
    [styles.late]: isLate,
    [styles.absent]: isAbsent && !isLastWeekMode,
  });

  const isDisabled = seat_active === 2 || seat_active === 6;

  return (
    <div className={cls} onClick={handleSeatClick}>
      {!isDisabled && (
        <>
          <span>{id}</span>
          <span>{name}</span>
        </>
      )}
    </div>
  );
};
