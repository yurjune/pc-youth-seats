import { Dialog, DialogActions, DialogContent, DialogTitle, DialogProps, Button, TextField } from '@mui/material';
import styles from './index.module.scss';

interface DeleteDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

export const DeleteDialog = (props: DeleteDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog id={styles.dialog} open={open} onClose={onClose}>
      <DialogTitle className={styles.title}>좌석 확인</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          <TextField
            className={styles.textField}
            id='seat'
            label='좌석'
            variant='standard'
            fullWidth
            inputProps={{ readOnly: true }}
          />
          <TextField
            className={styles.textField}
            id='name'
            label='예약자 이름'
            variant='standard'
            fullWidth
            inputProps={{ readOnly: true }}
          />
          <TextField className={styles.textField} id='pw' label='비밀번호' variant='standard' fullWidth />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success'>
            삭제
          </Button>
          <Button variant='contained' color='error' onClick={onClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
