import { atom } from 'jotai';
import { Seat } from '../shared/models';

export const selectedSeatAtom = atom<null | Seat>(null);

export const reserveDialogOpenAtom = atom(false);
export const deleteDialogOpenAtom = atom(false);
export const euodiaDialogOpenAtom = atom(false);
