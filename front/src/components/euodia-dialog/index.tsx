import { Dialog, DialogActions, DialogContent, DialogTitle, DialogProps, Button, TextField } from '@mui/material';
import styles from './index.module.scss';

interface EuodiaDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

export const EuodiaDialog = (props: EuodiaDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog id={styles.dialog} open={open} onClose={onClose}>
      <DialogTitle className={styles.title}>유오디아 확인</DialogTitle>
      <DialogContent>
        <div className={styles.textFieldContainer}>
          {/* <TextField className={styles.textField} id='euodia' label='유오디아' variant='standard' fullWidth autoFocus /> */}
          <TextField className={styles.textField} id='euodia' label='유오디아' variant='standard' fullWidth autoFocus />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success'>
            확인
          </Button>
          <Button variant='contained' color='error' onClick={onClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
