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
import { checkIsAvailableForReservation } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';

interface SeatBoxProps {
  seat: Seat;
  seatLine: string;
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
  const { seat, seatLine } = props;
  const { seat_active, id, name } = seat;
  const { isUserMode, isAttendanceMode } = useMode();
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const setSelectedSeatLine = useUpdateAtom(selectedSeatLineAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setDeleteDialogOpen = useUpdateAtom(deleteDialogOpenAtom);
  const setRedeemusDialogOpen = useUpdateAtom(redeemusDialogOpenAtom);
  const [isUpdatedLate, setIsUpdatedLate] = useState(false);

  useLayoutEffect(() => {
    if (!isAttendanceMode) {
      setIsUpdatedLate(false);
      return;
    }

    socket.emit('seatBoxRendered');

    socket.on('lateSeatList', (data) => {
      if (data.includes(seat.id)) {
        setIsUpdatedLate(true);
        return;
      }

      setIsUpdatedLate(false);
    });
  }, [isAttendanceMode, seat]);

  const handleSeatClick = async () => {
    if (!checkIsAvailableForReservation()) {
      toast.error('예약 가능한 시간대가 아닙니다.', { id: '1' });
      return;
    }

    if (isUpdatedLate) {
      socket.emit('lateSeatRemoved', seat.id);
      return;
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
    [styles.isUpdatedLate]: isUpdatedLate,
    [styles[`active-${seat_active}`]]: !isUpdatedLate,
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
