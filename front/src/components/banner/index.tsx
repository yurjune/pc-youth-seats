import { Alert, AlertProps } from '@mui/material';
import styles from './index.module.scss';

export const Banner = ({ children, ...bannerProps }: AlertProps) => {
  return (
    <div className={styles.alert}>
      <Alert {...bannerProps}>{children}</Alert>
    </div>
  );
};
