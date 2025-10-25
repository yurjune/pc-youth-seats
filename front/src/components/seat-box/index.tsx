import { useToastContext } from '@shared/context/ToastContext';
import { useMode } from '@shared/hooks/useMode';
import { Seat, SeatActive, SeatActiveToSeatClassMap } from '@shared/models/seat.model';
import socket from '@shared/socket';
import { getErrorMessage } from '@shared/utils';
import { checkIsAvailableForReservation } from '@shared/utils/time';
import clsx from 'clsx';
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
  const { openToast } = useToastContext();

  const { seat_active, id, group, name } = seat;
  const isLate = isAttendanceMode && lateSeatIds.includes(seat.id);
  const isAbsent = !isLate && !isUserMode && absentSeatIds.includes(seat.id);

  const handleSeatClick = async () => {
    if (isLastWeekMode) {
      return;
    }

    if (!checkIsAvailableForReservation()) {
      openToast.info('매주 월요일 오후 9시부터 예약 가능합니다.');
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
      openToast.error(getErrorMessage(error));
    }

    openDialog(seat, seatLine);
  };

  const cls = clsx(styles.seat, {
    [styles[SeatActiveToSeatClassMap[seat_active as SeatActive]]]:
      isLastWeekMode || (!isLate && !isAbsent),
    [styles.lastWeek]: isLastWeekMode,
    [styles.late]: isLate,
    [styles.absent]: isAbsent && !isLastWeekMode,
  });

  const isDisabled = seat_active === SeatActive.DISABLED || seat_active === SeatActive.INVISIBLE;

  return (
    <div className={cls} onClick={handleSeatClick}>
      {!isDisabled && (
        <>
          <span>{id}</span>
          <span>{group}</span>
          <span>{name}</span>
        </>
      )}
    </div>
  );
};
