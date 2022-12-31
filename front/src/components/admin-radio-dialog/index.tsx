import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  RadioGroupProps,
} from '@mui/material';
import { useAtom } from 'jotai';
import { adminRadioDialogOpenAtom } from '../../jotai';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const AdminRadioDialog = () => {
  const [open, setOpen] = useAtom(adminRadioDialogOpenAtom);
  const navigate = useNavigate();
  const [selection, setSelection] = useState('1');

  const updateSelection: RadioGroupProps['onChange'] = (_, value) => {
    setSelection(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOkClick = () => {
    switch (selection) {
      case '1':
        navigate('./admin');
        break;
      case '2':
        navigate('./attendance');
        break;
    }

    handleClose();
  };

  return (
    <Dialog id={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>관리자 확인</DialogTitle>
      <DialogContent>
        <RadioGroup name='use-radio-group' defaultValue='1' onChange={updateSelection}>
          <FormControlLabel value='1' label='관리자 페이지로 이동' control={<Radio color='secondary' />} />
          <FormControlLabel value='2' label='출석체크 페이지로 이동' control={<Radio color='secondary' />} />
        </RadioGroup>
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
