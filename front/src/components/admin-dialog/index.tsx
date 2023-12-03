import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom } from '@shared/atoms';
import { env } from '@shared/constants';
import { useInput } from '@shared/hooks/useInput';
import { encrypt } from '@shared/utils';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import styles from './index.module.scss';
import { useToastContext } from '@shared/context/ToastContext';

export const AdminDialog = () => {
  const setRadioDialogOpen = useUpdateAtom(adminRadioDialogOpenAtom);
  const setIsMaster = useUpdateAtom(isMasterAtom);
  const [open, setOpen] = useAtom(adminDialogOpenAtom);
  const [pw, handlePwChange, setPw] = useInput('');
  const { openToast } = useToastContext();

  const handleClose = () => {
    setOpen(false);
    setPw('');
  };

  const handleOkClick = () => {
    if (encrypt(pw) === env.ADMIN_PW) {
      setIsMaster(true);
      setRadioDialogOpen(true);
      handleClose();
      return;
    }

    openToast.error('비밀번호를 확인해주세요.');
  };

  return (
    <Dialog className={styles.dialog} open={open} onClose={handleClose}>
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
          <Button variant='outlined' color='error' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
