import clsx from 'clsx';
import { useUpdateAtom } from 'jotai/utils';
import toast from 'react-hot-toast';
import {
  deleteDialogOpenAtom,
  euodiaDialogOpenAtom,
  reserveDialogOpenAtom,
  selectedSeatAtom,
  selectedSeatLineAtom,
} from '../../jotai';
import service from '../../service';
import { Seat } from '../../shared/models';
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
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const setSelectedSeatLine = useUpdateAtom(selectedSeatLineAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setDeleteDialogOpen = useUpdateAtom(deleteDialogOpenAtom);
  const setEuodiaDialogOpen = useUpdateAtom(euodiaDialogOpenAtom);

  const cls = clsx(styles.seat, styles[`active-${seat_active}`]);
  const isDisabled = seat_active === 2 || seat_active === 6;

  const handleSeatClick = async () => {
    try {
      const result = await service.getReserveAbleFlag();
      if (!result) {
        toast.error('예약 가능한 시간대가 아닙니다.', { id: '1' });
        return;
      }
    } catch (error) {
      reportError(error);
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

        setEuodiaDialogOpen(true);
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

  return (
    <div className={cls} onClick={handleSeatClick}>
      {!isDisabled && (
        <>
          {id}
          <br />
          {name}
        </>
      )}
    </div>
  );
};
