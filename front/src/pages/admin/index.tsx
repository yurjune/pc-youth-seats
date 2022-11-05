import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog, EuodiaDialog, ReserveDialog, SeatBox, SeatInfo, Toaster } from '../../components';
import { AdminDialog } from '../../components/admin-dialog';
import { isAdminAtom } from '../../jotai';
import service from '../../service';
import { useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';

const Admin = () => {
  const [seats, setSeats, modifySeats] = useSeats();
  const isAdmin = useAtomValue(isAdminAtom);
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert('잘못된 접근입니다. 예약화면으로 돌아갑니다');
      navigate('/');
    }
  }, [navigate, isAdmin]);

  useEffect(() => {
    socket.on('chat', (data) => {
      modifySeats(data);
    });
  }, []);

  useEffect(() => {
    service
      .getSeats()
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));
  }, []);

  const renderSeats = () => {
    if (seats == null) {
      return;
    }

    return Object.keys(seats).map((line, idx) => (
      <div key={idx}>
        <div className={styles.line}>
          {seats[line].map((seat, idx) => {
            if (seat.seat_active === 0) {
              return <div key={idx} className={styles['active-0']} />;
            }

            return <SeatBox key={idx} seat={seat} seatLine={line} />;
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>강단</div>
        <div className={styles.seatContainer}>{renderSeats()}</div>
        <div className={styles.title}>입구</div>
        <div className={styles.info}>
          <SeatInfo />
        </div>
        <div className={styles.participants}>
          <span>좌석 현황: </span>
          <strong>{activeSeats}</strong>
          <span> / </span>
          <strong>{totalSeats}</strong>
        </div>
      </div>
      <ReserveDialog />
      <DeleteDialog />
      <EuodiaDialog />
      <AdminDialog />
      <Toaster />
    </>
  );
};

export default Admin;
