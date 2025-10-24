import { PropsWithChildren } from 'react';
import styles from './index.module.scss';

interface SeatsBodyProps {
  onEntranceClick?: () => void;
}

export const SeatsBody = ({ children }: PropsWithChildren<SeatsBodyProps>) => {
  return (
    <div>
      <div className={styles.title}>스크린</div>
      {children}
    </div>
  );
};
