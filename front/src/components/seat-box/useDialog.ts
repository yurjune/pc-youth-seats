import {
  deleteDialogOpenAtom,
  redeemusDialogOpenAtom,
  reserveDialogOpenAtom,
  selectedSeatAtom,
  selectedSeatLineAtom,
} from '@shared/atoms';
import { useMode } from '@shared/hooks/useMode';
import type { Seat } from '@shared/models/seat.model';
import { APPOINTED_SEATS } from '@shared/utils/seat';
import { useUpdateAtom } from 'jotai/utils';

export const useDialog = () => {
  const { isUserMode } = useMode();
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const setSelectedSeatLine = useUpdateAtom(selectedSeatLineAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setDeleteDialogOpen = useUpdateAtom(deleteDialogOpenAtom);
  const setRedeemusDialogOpen = useUpdateAtom(redeemusDialogOpenAtom);

  const openDialog = (seat: Seat, seatLine: string) => {
    if (APPOINTED_SEATS.includes(seat.name)) return;

    switch (seat.seat_active) {
      case 1: {
        setReserveDialogOpen(true);
        break;
      }
      case 4: {
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
