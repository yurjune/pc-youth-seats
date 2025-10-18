import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import api from '@shared/api';
import { reserveDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '@shared/atoms';
import { env } from '@shared/constants';
import { useToastContext } from '@shared/context/ToastContext';
import { useInputValidate } from '@shared/hooks/useInputValidate';
import { useMode } from '@shared/hooks/useMode';
import { SeatActive } from '@shared/models/seat.model';
import socket from '@shared/socket';
import { encrypt, getErrorMessage } from '@shared/utils';
import {
  getErrorFromValidators,
  validateName,
  validatePw,
  validatePwCheck,
} from '@shared/utils/validate';
import { useAtom } from 'jotai';
import styles from './index.module.scss';

export const ReserveDialog = () => {
  const { isUserMode, isAttendanceMode } = useMode();
  const [open, setOpen] = useAtom(reserveDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [name, handleNameChange, setName, nameValidator] = useInputValidate(validateName);
  const [pw, handlePwChange, setPw, pwValidator] = useInputValidate(validatePw);
  const [pwCheck, handlePwCheckChange, setPwCheck, pwCheckValidator] = useInputValidate(
    validatePwCheck(pw),
  );
  const { openToast } = useToastContext();

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setSelectedSeatLine(null);
  };

  const resetAllStates = () => {
    setOpen(false);
    setSelectedSeat(null);
    setSelectedSeatLine(null);
    setName('');
    setPw('');
    setPwCheck('');
  };

  const handleOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    const validators = isUserMode
      ? [nameValidator, pwValidator, pwCheckValidator]
      : [nameValidator];
    const error = getErrorFromValidators(validators);
    if (error) {
      openToast.error(error);
      return;
    }

    try {
      const params = {
        id: selectedSeat.id,
        seat_active: SeatActive.RESERVED,
        line: selectedSeatLine,
        name,
        pw: isUserMode ? encrypt(pw) : env.ADMIN_PW,
      };

      const result = await api.makeReservation(params);
      const { ok, message } = result;

      if (ok) {
        socket.emit('seatReserved', { ...params, ignoreIsLate: isAttendanceMode });
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
      <DialogTitle className={styles.title}>좌석 예약</DialogTitle>
      <DialogContent>
        {isUserMode && (
          <DialogContentText className={styles.contentText}>
            * 예약 가능 시간: 매주 월요일 오후 9시 ~
            <br />* 부득이한 이유로 불참 시 다른 분들을 위해 좌석 예약을 취소해 주세요.
          </DialogContentText>
        )}
        <div>
          <TextField
            value={name}
            onChange={handleNameChange}
            className={styles.textField}
            helperText={nameValidator.error}
            id='name'
            label='이름'
            variant='standard'
            fullWidth
            color='secondary'
          />
          {isUserMode && (
            <>
              <TextField
                value={pw}
                onChange={handlePwChange}
                className={styles.textField}
                helperText={pwValidator.error}
                id='pw'
                label='비밀번호'
                type='password'
                variant='standard'
                fullWidth
                color='secondary'
              />
              <TextField
                value={pwCheck}
                onChange={handlePwCheckChange}
                className={styles.textField}
                helperText={pwCheckValidator.error}
                id='pwcheck'
                label='비밀번호 확인'
                type='password'
                variant='standard'
                fullWidth
                color='secondary'
              />
            </>
          )}
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='outlined' color='primary' onClick={handleOkClick}>
            예약
          </Button>
          <Button variant='outlined' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
