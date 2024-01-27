import {
  deleteDialogOpenAtom,
  redeemusDialogOpenAtom,
  reserveDialogOpenAtom,
  selectedSeatAtom,
  selectedSeatLineAtom,
} from '@shared/atoms';
import { useMode } from '@shared/hooks/useMode';
import type { Seat } from '@shared/models/seat.model';
import { APPOINTED_SEAT_NAMES } from '@shared/utils/seat';
import { useUpdateAtom } from 'jotai/utils';

export const useDialog = () => {
  const { isUserMode } = useMode();
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const setSelectedSeatLine = useUpdateAtom(selectedSeatLineAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setDeleteDialogOpen = useUpdateAtom(deleteDialogOpenAtom);
  const setRedeemusDialogOpen = useUpdateAtom(redeemusDialogOpenAtom);

  const openDialog = (seat: Seat, seatLine: string) => {
    switch (seat.seat_active) {
      case 1: {
        setReserveDialogOpen(true);
        break;
      }
      case 4: {
        if (APPOINTED_SEAT_NAMES.includes(seat.name)) return;

        if (isUserMode) {
          setRedeemusDialogOpen(true);
        } else {
          setReserveDialogOpen(true);
        }
        break;
      }
      case 5: {
        setDeleteDialogOpen(true);
        break;
      }
      default:
        return;
    }

    setSelectedSeat(seat);
    setSelectedSeatLine(seatLine);
  };

  return { openDialog } as const;
};
