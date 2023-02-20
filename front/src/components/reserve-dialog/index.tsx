import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { reserveDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '../../jotai';
import { useInputValidate, useMode } from '../../shared/hooks';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import service from '../../service';
import {
  encrypt,
  getErrorFromValidators,
  reportErrorMessage,
  validateName,
  validatePw,
  validatePwCheck,
} from '../../shared/utilities';
import socket from '../../socket';
import { env } from '../../shared/constants';

export const ReserveDialog = () => {
  const { isUserMode, isAttendanceMode } = useMode();
  const [open, setOpen] = useAtom(reserveDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [name, handleNameChange, setName, nameValidator] = useInputValidate(validateName);
  const [pw, handlePwChange, setPw, pwValidator] = useInputValidate(validatePw);
  const [pwCheck, handlePwCheckChange, setPwCheck, pwCheckValidator] = useInputValidate(validatePwCheck(pw));

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

  const handleUserOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    const validators = [nameValidator, pwValidator, pwCheckValidator];
    const error = getErrorFromValidators(validators);
    if (error) {
      toast.error(error, { id: error });
      return;
    }

    try {
      const params = {
        id: selectedSeat.id,
        seat_active: 5,
        name,
        pw: encrypt(pw),
        line: selectedSeatLine,
      };
      const result = await service.makeReservation(params);
      const { ok, message } = result;

      if (!ok) {
        toast.error(message, { id: '3' });
        return;
      }

      if (ok) {
        socket.emit('seatReserved', params);
        toast.success(message, { id: '4' });

        resetAllStates();
        return;
      }
    } catch (error) {
      reportErrorMessage(error, '5');
    }
  };

  const handleMasterOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    const validators = [nameValidator];
    const error = getErrorFromValidators(validators);
    if (error) {
      toast.error(error, { id: error });
      return;
    }

    try {
      const params = {
        id: selectedSeat.id,
        seat_active: 5,
        name,
        pw: env.ADMIN_PW,
        line: selectedSeatLine,
      };
      const result = await service.makeReservation(params);
      const { ok, message } = result;

      if (!ok) {
        toast.error(message, { id: message });
        return;
      }

      if (ok) {
        const ignoreIsLate = isAttendanceMode ? true : false;
        socket.emit('seatReserved', {
          ...params,
          ignoreIsLate,
        });
        toast.success(message, { id: message });

        resetAllStates();
        return;
      }
    } catch (error) {
      reportErrorMessage(error, '1');
    }
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>좌석 예약</DialogTitle>
      <DialogContent>
        {isUserMode && (
          <DialogContentText className={styles.contentText}>
            * 예약 가능 시간: 매주 월요일 오후 9시 ~ 주일 예배 직전
            <br />* 부득이한 이유로 불참 시 다른 분들을 위해 좌석 예약을 취소해 주세요.
          </DialogContentText>
        )}
        <div className={styles.textFieldContainer}>
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
          <Button variant='contained' color='success' onClick={isUserMode ? handleUserOkClick : handleMasterOkClick}>
            예약
          </Button>
          <Button variant='contained' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
