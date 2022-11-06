import { atom } from 'jotai';
import { Seat } from '../shared/models';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage<boolean>(() => sessionStorage);

export const isMasterAtom = atomWithStorage<boolean>('isMasterAtomKey', false, storage);

export const selectedSeatAtom = atom<null | Seat>(null);
export const selectedSeatLineAtom = atom<null | string>(null);

export const reserveDialogOpenAtom = atom(false);
export const deleteDialogOpenAtom = atom(false);
export const euodiaDialogOpenAtom = atom(false);
export const adminDialogOpenAtom = atom(false);
export const adminRadioDialogOpenAtom = atom(false);
export const searchDialogOpenAtom = atom(false);
