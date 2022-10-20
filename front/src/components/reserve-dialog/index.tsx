import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { reserveDialogOpenAtom, selectedSeatAtom } from '../../jotai';
import { useInput } from '../../shared/hooks';
import styles from './index.module.scss';
import toast from 'react-hot-toast';

export const ReserveDialog = () => {
  const [open, setOpen] = useAtom(reserveDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [name, handleChangeName, setName] = useInput();
  const [pw, handleChangePw, setPw] = useInput();
  const [pwCheck, handleChangePwCheck, setPwCheck] = useInput();
  const [validation, setValidation] = useState({
    name: false,
    pw: false,
    pwCheck: false,
  });

  const handleOkClick = () => {
    if (selectedSeat == null) {
      return;
    }

    if (!validation.name || !validation.pw) {
      toast.error('이름 또는 비밀번호를 적어주세요.', {
        id: '1',
      });
      return;
    }

    if (!validation.pwCheck) {
      toast.error('비밀번호가 일치하지 않습니다.', {
        id: '2',
      });
      return;
    }

    toast.success('예약 되었습니다.', {
      id: '3',
    });
    setOpen(false);
    setSelectedSeat(null);
    setName('');
    setPw('');
    setPwCheck('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
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
        <DialogContentText className={styles.contentText}>
          *좌석 예약 가능 시간: 매주 월요일 오후 9시 ~ 주일 예배 직전
          <br />
          (이외 시간에 예약 시 예약 내용이 삭제 될 수 있으니 주의해 주세요.)
          <br />
          *부득이한 이유로 불참 시 다른 분들을 위해 좌석 예약을 취소해 주세요.
        </DialogContentText>
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
          />
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
          />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success' onClick={handleOkClick}>
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