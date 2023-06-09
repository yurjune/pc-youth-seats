import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { Seat } from './models';

const storage = createJSONStorage<boolean>(() => sessionStorage);

export const isMasterAtom = atomWithStorage<boolean>('isMasterAtomKey', false, storage);

export const selectedSeatAtom = atom<null | Seat>(null);
export const selectedSeatLineAtom = atom<null | string>(null);

export const reserveDialogOpenAtom = atom(false);
export const deleteDialogOpenAtom = atom(false);
export const redeemusDialogOpenAtom = atom(false);
export const adminDialogOpenAtom = atom(false);
export const adminRadioDialogOpenAtom = atom(false);
