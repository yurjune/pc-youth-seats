import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { reserveDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '../../jotai';
import { useInput, useMode } from '../../shared/hooks';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import service from '../../service';
import { encrypt, reportErrorMessage } from '../../shared/utilities';
import socket from '../../socket';
import { ADMIN_PW } from '../../shared/constants';

export const ReserveDialog = () => {
  const { isUserMode, isAttendanceMode } = useMode();
  const [open, setOpen] = useAtom(reserveDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [name, handleChangeName, setName] = useInput();
  const [pw, handleChangePw, setPw] = useInput();
  const [pwCheck, handleChangePwCheck, setPwCheck] = useInput();
  const [validation, setValidation] = useState({
    name: false,
    pw: false,
    pwCheck: false,
  });

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
    setValidation({
      name: false,
      pw: false,
      pwCheck: false,
    });
  };

  const handleUserOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    if (!validation.name || !validation.pw) {
      toast.error('이름 또는 비밀번호를 적어주세요.', { id: '1' });
      return;
    }

    if (!validation.pwCheck) {
      toast.error('비밀번호가 일치하지 않습니다.', { id: '2' });
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

    if (!validation.name) {
      toast.error('이름을 적어주세요.', { id: '1' });
      return;
    }

    try {
      const params = {
        id: selectedSeat.id,
        seat_active: 5,
        name,
        pw: ADMIN_PW,
        line: selectedSeatLine,
      };
      const result = await service.makeReservation(params);
      const { ok, message } = result;

      if (!ok) {
        toast.error(message, { id: '2' });
        return;
      }

      if (ok) {
        const ignoreIsLate = isAttendanceMode ? true : false;
        socket.emit('seatReserved', {
          ...params,
          ignoreIsLate,
        });
        toast.success(message, { id: '3' });

        resetAllStates();
        return;
      }
    } catch (error) {
      reportErrorMessage(error, '4');
    }
  };

  const nameValidate = useMemo(() => {
    if (name.length === 0) {
      setValidation((prev) => ({ ...prev, name: false }));
      return ' ';
    }

    if (name.length === 1) {
      setValidation((prev) => ({ ...prev, name: false }));
      return '이름을 최소 2글자 이상 입력해주세요';
    }

    setValidation((prev) => ({ ...prev, name: true }));
    return ' ';
  }, [name]);

  const pwValidate = useMemo(() => {
    if (pw.length === 0) {
      setValidation((prev) => ({ ...prev, pw: false }));
      return ' ';
    }

    if (pw.length > 0 && pw.length < 4) {
      setValidation((prev) => ({ ...prev, pw: false }));
      return '최소한 4글자 이상 적어주세요.';
    }

    setValidation((prev) => ({ ...prev, pw: true }));
    return ' ';
  }, [pw]);

  const pwCheckValidate = useMemo(() => {
    if (pwCheck.length === 0) {
      setValidation((prev) => ({ ...prev, pwCheck: false }));
      return ' ';
    }

    if (pw !== pwCheck) {
      setValidation((prev) => ({ ...prev, pwCheck: false }));
      return '비밀번호가 일치하지 않습니다.';
    }

    setValidation((prev) => ({ ...prev, pwCheck: true }));
    return '비밀번호가 일치합니다.';
  }, [pw, pwCheck]);

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
            onChange={handleChangeName}
            className={styles.textField}
            id='name'
            label='이름'
            variant='standard'
            fullWidth
            helperText={nameValidate}
            color='secondary'
          />
          {isUserMode && (
            <>
              <TextField
                value={pw}
                onChange={handleChangePw}
                className={styles.textField}
                id='pw'
                label='비밀번호'
                type='password'
                variant='standard'
                fullWidth
                helperText={pwValidate}
                color='secondary'
              />
              <TextField
                value={pwCheck}
                onChange={handleChangePwCheck}
                className={styles.textField}
                id='pwcheck'
                label='비밀번호 확인'
                type='password'
                variant='standard'
                fullWidth
                helperText={pwCheckValidate}
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
