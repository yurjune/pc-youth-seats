import { Alert, Snackbar, SnackbarProps } from '@mui/material';
import { ReactNode, createContext, useContext, useState } from 'react';
import styles from './Toast.module.scss';

export type Severity = 'info' | 'success';

export type ToastContextType = {
  open: boolean;
  message: string;
  type: Severity;
  openToast: {
    info: (msg: string) => void;
    success: (msg: string) => void;
  };
};

const ToastContext = createContext<ToastContextType>({
  open: false,
  message: '',
  type: 'info',
  openToast: {
    info: () => undefined,
    success: () => undefined,
  },
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Severity>('info');

  const openToast = {
    info: (message: string) => {
      setOpen(true);
      setMessage(message);
      setType('info');
    },
    success: (message: string) => {
      setOpen(true);
      setMessage(message);
      setType('success');
    },
  };

  const handleClose: SnackbarProps['onClose'] = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ open, type, message, openToast }}>
      {children}
      <Snackbar
        className={styles.toast}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert className={styles.alert} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const toastContext = useContext(ToastContext);
  if (!toastContext) throw Error('Context cannot be null!');
  return toastContext;
}
