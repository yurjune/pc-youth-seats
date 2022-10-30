import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { adminDialogOpenAtom, isAdminAtom } from '../../jotai';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import { useInput } from '../../shared/hooks';
import { encrypt } from '../../shared/utilities';
import { ADMIN_PW } from '../../shared/constants';
import { useNavigate } from 'react-router-dom';

export const AdminDialog = () => {
  const setIsAdmin = useUpdateAtom(isAdminAtom);
  const [open, setOpen] = useAtom(adminDialogOpenAtom);
  const [pw, handlePwChange, setPw] = useInput('');
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setPw('');
  };

  const handleOkClick = () => {
    if (encrypt(pw) === ADMIN_PW) {
      setIsAdmin(true);
      handleClose();
      navigate('/admin');
      return;
    }

    toast.error('비밀번호를 확인해주세요.', { id: '1' });
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>관리자 확인</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          <TextField
            value={pw}
            onChange={handlePwChange}
            className={styles.textField}
            id='pw'
            label='비밀번호'
            variant='standard'
            color='success'
            type='password'
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
