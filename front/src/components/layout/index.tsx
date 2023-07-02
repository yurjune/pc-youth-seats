import { ReactNode } from 'react';
import styles from './index.module.scss';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
};
