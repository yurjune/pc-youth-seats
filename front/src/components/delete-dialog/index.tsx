import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { deleteDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '../../shared/atoms';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import { useInput, useMode } from '../../shared/hooks';
import api from '../../shared/api';
import { encrypt, reportErrorMessage } from '../../shared/utils';
import socket from '../../socket';
import { env } from '../../shared/constants';

export const DeleteDialog = () => {
  const { isUserMode, isAttendanceMode } = useMode();
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [pw, handleChangePw, setPw] = useInput();

  const handleClose = () => {
    resetAllStates();
  };

  const resetAllStates = () => {
    setOpen(false);
    setSelectedSeat(null);
    setSelectedSeatLine(null);
    setPw('');
  };

  const handleUserOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    if (encrypt(pw) !== env.ADMIN_PW && encrypt(pw) !== selectedSeat.pw) {
      const message = '비밀번호를 확인해주세요. 잊으셨다면 임원에게 문의해주세요.';
      toast.error(message, { id: message });
      return;
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
        });

        resetAllStates();
        toast.success(message, { id: message });
      } else {
        toast.error(message, { id: message });
      }
    } catch (error) {
      reportErrorMessage(error);
    }
  };

  const handleMasterOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    try {
      const params = {
        id: selectedSeat.id,
        line: selectedSeatLine,
      };
      const result = await api.cancelReservation(params);
      const { ok, message } = result;

      if (ok) {
        const ignoreIsLate = isAttendanceMode ? true : false;
        socket.emit('seatRemoved', {
          ...params,
          seat_active: result.defaultSeatActive,
          name: result.defaultSeatName,
          pw: '',
          ignoreIsLate,
        });

        resetAllStates();
        toast.success(message, { id: message });
      } else {
        toast.error(message, { id: message });
      }
    } catch (error) {
      reportErrorMessage(error);
    }
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
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
          <Button variant='contained' color='success' onClick={isUserMode ? handleUserOkClick : handleMasterOkClick}>
            삭제
          </Button>
          <Button variant='contained' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
