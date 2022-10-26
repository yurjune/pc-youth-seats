import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import toast from 'react-hot-toast';
import { euodiaDialogOpenAtom, reserveDialogOpenAtom, selectedSeatAtom } from '../../jotai';
import { EUODIA_PW } from '../../shared/constants';
import { useInput } from '../../shared/hooks';
import { encrypt } from '../../shared/utilities';
import styles from './index.module.scss';

export const EuodiaDialog = () => {
  const [open, setOpen] = useAtom(euodiaDialogOpenAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const [pw, handlePw, setPw] = useInput();

  const handleOkClick = () => {
    if (encrypt(pw) === EUODIA_PW) {
      setOpen(false);
      setPw('');
      setReserveDialogOpen(true);
      return;
    }

    toast.error('비밀번호가 틀렸습니다.', { id: '1' });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setPw('');
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>유오디아 확인</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          <TextField
            value={pw}
            onChange={handlePw}
            className={styles.textField}
            type='password'
            id='euodia'
            label='유오디아'
            variant='standard'
            color='success'
            fullWidth
          />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success' onClick={handleOkClick}>
            확인
          </Button>
          <Button variant='contained' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
