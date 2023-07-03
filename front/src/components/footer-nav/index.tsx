import { ReactNode } from 'react';
import styles from './index.module.scss';

export const FooterNav = ({ children }: { children: ReactNode }) => {
  return <footer className={styles.container}>{children}</footer>;
};
