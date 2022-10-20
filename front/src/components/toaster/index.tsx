import { Toaster as HotToaster } from 'react-hot-toast';
import styles from './index.module.scss';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const toastOptions = {
  className: styles.inner,
  duration: 3000,
  error: {
    icon: <InfoIcon htmlColor='#e6a23c' fontSize='small' />,
    style: {
      background: '#fdf6ec',
      color: '#e6a23c',
    },
  },
  success: {
    icon: <CheckCircleIcon htmlColor='#67c23a' fontSize='small' />,
    style: {
      background: '#f0f9eb',
      color: '#67c23a',
    },
  },
};

export const Toaster = () => {
  return <HotToaster position='top-center' toastOptions={toastOptions} />;
};
