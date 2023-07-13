import { CircularProgress } from '@mui/material';
import styles from './index.module.scss';

export const Spinner = () => {
  return (
    <div className={styles.container}>
      <CircularProgress color='secondary' disableShrink />
    </div>
  );
};
