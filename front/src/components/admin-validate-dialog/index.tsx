import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { adminValidateDialogOpenAtom, isMasterAtom } from '@shared/atoms';
import { env } from '@shared/constants';
import { useToastContext } from '@shared/context/ToastContext';
import { useInput } from '@shared/hooks/useInput';
import { encrypt } from '@shared/utils';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

export const AdminValidateDialog = () => {
  const navigate = useNavigate();

  const setIsMaster = useUpdateAtom(isMasterAtom);
  const [open, setOpen] = useAtom(adminValidateDialogOpenAtom);
  const [pw, handlePwChange, setPw] = useInput('');
  const { openToast } = useToastContext();

  const handleClose = (success: boolean) => {
    setOpen(false);
    setPw('');

    if (!success) {
      navigate('/');
    }
  };

  const handleOkClick = () => {
    if (encrypt(pw) === env.ADMIN_PW) {
      setIsMaster(true);
      handleClose(true);
      return;
    }

    openToast.error('비밀번호를 확인해주세요.');
  };

  return (
    <Dialog className={styles.dialog} open={open} onClose={() => handleClose(false)}>
      <DialogTitle className={styles.title}>관리자 확인</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            value={pw}
            onChange={handlePwChange}
            className={styles.textField}
            id='pw'
            label='비밀번호'
            variant='standard'
            color='secondary'
            type='password'
            fullWidth
            helperText=' '
          />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='outlined' color='primary' onClick={handleOkClick}>
            확인
          </Button>
          <Button variant='outlined' color='error' onClick={() => handleClose(false)}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
