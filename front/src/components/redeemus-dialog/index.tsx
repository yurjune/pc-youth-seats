import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { redeemusDialogOpenAtom, reserveDialogOpenAtom, selectedSeatAtom } from '@shared/atoms';
import { env } from '@shared/constants';
import { useInput } from '@shared/hooks/useInput';
import { encrypt } from '@shared/utils';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import styles from './index.module.scss';
import { useToastContext } from '@shared/context/ToastContext';

export const RedeemusDialog = () => {
  const [open, setOpen] = useAtom(redeemusDialogOpenAtom);
  const setReserveDialogOpen = useUpdateAtom(reserveDialogOpenAtom);
  const setSelectedSeat = useUpdateAtom(selectedSeatAtom);
  const [pw, handlePw, setPw] = useInput();
  const { openToast } = useToastContext();

  const handleOkClick = () => {
    if (encrypt(pw) === env.REDEEMUS_PW) {
      setOpen(false);
      setPw('');
      setReserveDialogOpen(true);
      return;
    }

    openToast.error('비밀번호가 틀렸습니다.');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setPw('');
  };

  return (
    <Dialog className={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>리디머스 확인</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            value={pw}
            onChange={handlePw}
            className={styles.textField}
            type='password'
            id='redeemus'
            label='리디머스'
            variant='standard'
            color='secondary'
            fullWidth
            helperText=' '
          />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='outlined' color='primary' onClick={handleOkClick}>
            확인
          </Button>
          <Button variant='outlined' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
