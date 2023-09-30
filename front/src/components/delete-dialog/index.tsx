import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import api from '@shared/api';
import { deleteDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '@shared/atoms';
import { env } from '@shared/constants';
import { useInput, useMode } from '@shared/hooks';
import socket from '@shared/socket';
import { encrypt, getErrorMessage } from '@shared/utils';
import { useAtom } from 'jotai';
import styles from './index.module.scss';
import { useToastContext } from '@shared/context/ToastContext';

export const DeleteDialog = () => {
  const { isUserMode, isAttendanceMode } = useMode();
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [pw, handleChangePw, setPw] = useInput();
  const { openToast } = useToastContext();

  const handleClose = () => {
    resetAllStates();
  };

  const resetAllStates = () => {
    setOpen(false);
    setSelectedSeat(null);
    setSelectedSeatLine(null);
    setPw('');
  };

  const handleOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    if (isUserMode) {
      if (encrypt(pw) !== env.ADMIN_PW && encrypt(pw) !== selectedSeat.pw) {
        const message = '비밀번호를 확인해주세요. 잊으셨다면 임원에게 문의해주세요.';
        openToast.error(message);
        return;
      }
    }

    try {
      const params = {
        id: selectedSeat.id,
        line: selectedSeatLine,
      };
      const result = await api.cancelReservation(params);
      const { ok, message } = result;

      if (ok) {
        socket.emit('seatRemoved', {
          ...params,
          seat_active: result.defaultSeatActive,
          name: result.defaultSeatName,
          pw: '',
          ignoreIsLate: isAttendanceMode,
        });

        resetAllStates();
        openToast.success(message);
      } else {
        openToast.error(message);
      }
    } catch (error) {
      openToast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog className={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>좌석 확인</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          <TextField
            value={selectedSeat?.id ?? ''}
            className={styles.textField}
            id='seat'
            label='좌석'
            variant='standard'
            color='secondary'
            fullWidth
            inputProps={{ readOnly: true }}
            helperText=' '
          />
          <TextField
            value={selectedSeat?.name ?? ''}
            className={styles.textField}
            id='name'
            label='예약자 이름'
            variant='standard'
            color='secondary'
            fullWidth
            inputProps={{ readOnly: true }}
            helperText=' '
          />
          {isUserMode && (
            <TextField
              value={pw}
              onChange={handleChangePw}
              className={styles.textField}
              id='pw'
              label='비밀번호'
              type='password'
              variant='standard'
              color='secondary'
              fullWidth
              helperText=' '
            />
          )}
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='outlined' color='primary' onClick={handleOkClick}>
            삭제
          </Button>
          <Button variant='outlined' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
