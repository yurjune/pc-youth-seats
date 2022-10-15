import clsx from 'clsx';
import styles from './index.module.scss';

export const SeatInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-1'])} />
        <span>선택 가능</span>
      </div>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-2'])} />
        <span>선택 불가</span>
      </div>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-4'])} />
        <span>지정 좌석</span>
      </div>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-5'])} />
        <span>선택 완료</span>
      </div>
    </div>
  );
};
