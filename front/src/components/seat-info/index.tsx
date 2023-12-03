import { useMode } from '@shared/hooks/useMode';
import clsx from 'clsx';
import styles from './index.module.scss';

export const SeatInfo = () => {
  const { isUserMode, isAdminMode, isAttendanceMode } = useMode();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-1'])} />
        <span>선택 가능</span>
      </div>
      {/* <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-2'])} />
        <span>선택 불가</span>
      </div> */}
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-4'])} />
        <span>지정 좌석</span>
      </div>
      <div className={styles.box}>
        <div className={clsx(styles.seat, styles['active-5'])} />
        <span>선택 완료</span>
      </div>
      {isAttendanceMode ? (
        <>
          <div className={styles.box}>
            <div className={clsx(styles.seat, styles.late)} />
            <span>늦은 예약</span>
          </div>
        </>
      ) : null}
      {!isUserMode ? (
        <>
          <div className={styles.box}>
            <div className={clsx(styles.seat, styles.absent)} />
            <span>미출석자</span>
          </div>
        </>
      ) : null}
      {isAdminMode ? (
        <div className={styles.box}>
          <div className={clsx(styles.seat, styles.lastWeek)} />
          <span>지난 주</span>
        </div>
      ) : null}
    </div>
  );
};
