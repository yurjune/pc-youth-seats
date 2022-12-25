import clsx from 'clsx';
import { useUpdateAtom } from 'jotai/utils';
import { useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  deleteDialogOpenAtom,
  redeemusDialogOpenAtom,
  reserveDialogOpenAtom,
  selectedSeatAtom,
  selectedSeatLineAtom,
} from '../../jotai';
import { useMode } from '../../shared/hooks';
import { Seat } from '../../shared/models';
import { checkIsAvailableForReservation, reportErrorMessage } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';

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
  const { seat, seatLine, lateSeatIds = [], absentSeatIds = [], isAbsentMode = false, isLastWeekMode = false } = props;
  const { seat_active, id, name } = seat;
  const { isUserMode, isAttendanceMode } = useMode();
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const setSelectedSeatLine = useUpdateAtom(selectedSeatLineAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setDeleteDialogOpen = useUpdateAtom(deleteDialogOpenAtom);
  const setRedeemusDialogOpen = useUpdateAtom(redeemusDialogOpenAtom);
  const [isLate, setIsLate] = useState(false);
  const [isAbsent, setIsAbsent] = useState(false);

  useLayoutEffect(() => {
    if (!isAttendanceMode) {
      return;
    }

    setIsLate(false);
    for (const id of lateSeatIds) {
      if (id === seat.id) {
        setIsLate(true);
        return;
      }
    }

    setIsAbsent(false);
    for (const id of absentSeatIds) {
      if (id === seat.id) {
        setIsAbsent(true);
        return;
      }
    }
  }, [isAttendanceMode, seat, lateSeatIds, absentSeatIds]);

  const handleSeatClick = async () => {
    if (isLastWeekMode) {
      return;
    }

    if (!checkIsAvailableForReservation()) {
      toast.error('예약 가능한 시간대가 아닙니다.', { id: '1' });
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
      reportErrorMessage(error, '2');
    }

    switch (seat_active) {
      case 1: {
        setReserveDialogOpen(true);
        setSelectedSeat(seat);
        setSelectedSeatLine(seatLine);
        break;
      }
      case 4: {
        // 교역자, 방송팀, ...
        if (seat.name) {
          break;
        }

        setRedeemusDialogOpen(true);
        setSelectedSeat(seat);
        setSelectedSeatLine(seatLine);
        break;
      }
      case 5: {
        setDeleteDialogOpen(true);
        setSelectedSeat(seat);
        setSelectedSeatLine(seatLine);
        break;
      }
    }
  };

  const cls = clsx(styles.seat, {
    [styles[`active-${seat_active}`]]: !isLate && !isAbsent,
    [styles.lastWeek]: isLastWeekMode,
    [styles.late]: isLate,
    [styles.absent]: !isLate && isAbsent,
  });

  const isDisabled = seat_active === 2 || seat_active === 6;
  const isRenderName = !isUserMode || seat_active === 4;

  return (
    <div className={cls} onClick={handleSeatClick}>
      {!isDisabled && (
        <>
          {id}
          <br />
          {isRenderName && name}
        </>
      )}
    </div>
  );
};
