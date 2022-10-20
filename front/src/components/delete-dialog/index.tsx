import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { deleteDialogOpenAtom, selectedSeatAtom } from '../../jotai';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import { useInput } from '../../shared/hooks';

export const DeleteDialog = () => {
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [pw, handleChangePw, setPw] = useInput();

  const handleOkClick = () => {
    if (selectedSeat == null) {
      return;
    }

    if (pw !== selectedSeat.pw) {
      toast.error('비밀번호를 확인해주세요. 잊으셨다면 임원에게 문의해주세요.', {
        id: '1',
      });
      return;
    }

    setOpen(false);
    setSelectedSeat(null);
    setPw('');
    toast.success('삭제 되었습니다.', {
      id: '2',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setPw('');
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
            fullWidth
            inputProps={{ readOnly: true }}
            helperText=' '
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
            helperText=' '
          />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success' onClick={handleOkClick}>
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
