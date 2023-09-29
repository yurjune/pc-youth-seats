import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material';
import { adminRadioDialogOpenAtom } from '@shared/atoms';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

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
    <Dialog className={styles.dialog} open={open} onClose={handleClose}>
      <DialogTitle className={styles.title}>관리자 확인</DialogTitle>
      <DialogContent>
        <RadioGroup name='use-radio-group' defaultValue='1' onChange={updateSelection}>
          <FormControlLabel
            value='1'
            label='관리자 페이지로 이동'
            control={<Radio color='secondary' />}
          />
          <FormControlLabel
            value='2'
            label='출석체크 페이지로 이동'
            control={<Radio color='secondary' />}
          />
        </RadioGroup>
        <DialogActions className={styles.actions}>
          <Button variant='outlined' color='primary' onClick={handleOkClick}>
            확인
          </Button>
          <Button variant='outlined' color='warning' onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
