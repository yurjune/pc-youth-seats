import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
  Button,
  TextField,
} from '@mui/material';
import styles from './index.module.scss';

interface ReserveDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

export const ReserveDialog = (props: ReserveDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog id={styles.dialog} open={open} onClose={onClose}>
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
          <TextField className={styles.textField} id='name' label='이름' variant='standard' fullWidth />
          <TextField className={styles.textField} id='pw' label='비밀번호' variant='standard' fullWidth />
          <TextField className={styles.textField} id='pwcheck' label='비밀번호 확인' variant='standard' fullWidth />
        </div>
        <DialogActions className={styles.actions}>
          <Button variant='contained' color='success'>
            예약
          </Button>
          <Button variant='contained' color='error' onClick={onClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
