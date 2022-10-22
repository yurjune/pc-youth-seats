import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { deleteDialogOpenAtom, selectedSeatAtom, selectedSeatLineAtom } from '../../jotai';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import { useInput } from '../../shared/hooks';
import service from '../../service';
import { reportErrorMessage } from '../../shared/utilities';
import socket from '../../socket';

export const DeleteDialog = () => {
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [selectedSeat, setSelectedSeat] = useAtom(selectedSeatAtom);
  const [selectedSeatLine, setSelectedSeatLine] = useAtom(selectedSeatLineAtom);
  const [pw, handleChangePw, setPw] = useInput();

  const handleOkClick = async () => {
    if (selectedSeat == null || selectedSeatLine == null) {
      return;
    }

    if (pw !== selectedSeat.pw) {
      toast.error('비밀번호를 확인해주세요. 잊으셨다면 임원에게 문의해주세요.', { id: '1' });
      return;
    }

    try {
      const params = {
        seat: selectedSeatLine,
        seatId: selectedSeat.id,
        seatPlace: 'xion',
      };
      const result = await service.deleteSeatsReservation(params);

      if (result.resFlag === false) {
        toast.error('Something went wrong', { id: '2' });
      }

      if (result.resFlag === true) {
        socket.emit('chat', {
          ...params,
          name: '',
          pw: '',
          seat_active: result.orgActive,
        });

        setOpen(false);
        setSelectedSeat(null);
        setSelectedSeatLine(null);
        setPw('');
        toast.success('삭제 되었습니다.', { id: '3' });
      }
    } catch (error) {
      reportErrorMessage(error, '4');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSeat(null);
    setSelectedSeatLine(null);
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
