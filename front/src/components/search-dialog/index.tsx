import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { searchDialogOpenAtom } from '../../jotai';
import service from '../../service';
import { useGAEventsTracker, useInput } from '../../shared/hooks';
import { encrypt, reportErrorMessage } from '../../shared/utilities';
import styles from './index.module.scss';

export const SearchDialog = () => {
  const [open, setOpen] = useAtom(searchDialogOpenAtom);
  const [name, handleName] = useInput();
  const [pw, handlePw] = useInput();
  const { trackEvent } = useGAEventsTracker();

  const handleOkClick = async () => {
    trackEvent('find_my_seat');

    try {
      const body = {
        name,
        pw: encrypt(pw),
      };

      const result = await service.searchSeat(body);
      if (result) {
        toast.success(`좌석은 ${result} 입니다.`, { id: '1' });
        return;
      }

      if (result === false) {
        toast.error('좌석정보를 찾을 수 없습니다.', { id: '2' });
        return;
      }
    } catch (error) {
      reportErrorMessage(error, '3');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>내 좌석 찾기</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          <TextField
            value={name}
            onChange={handleName}
            className={styles.textField}
            id='name'
            label='이름'
            variant='standard'
            color='success'
            fullWidth
            helperText=' '
          />
          <TextField
            value={pw}
            onChange={handlePw}
            className={styles.textField}
            type='password'
            id='pw'
            label='비밀번호'
            variant='standard'
            color='success'
            fullWidth
            helperText=' '
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
