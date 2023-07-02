import { PropsWithChildren } from 'react';
import styles from './index.module.scss';

interface SeatsBodyProps {
  onEntranceClick?: () => void;
}

export const SeatsBody = ({ children, onEntranceClick }: PropsWithChildren<SeatsBodyProps>) => {
  return (
    <div>
      <div className={styles.title}>강단</div>
      {children}
      <div className={styles.title} onClick={onEntranceClick}>
        입구
      </div>
    </div>
  );
};
