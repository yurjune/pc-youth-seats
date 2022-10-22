import { useEffect } from 'react';
import { DeleteDialog, EuodiaDialog, ReserveDialog, SeatBox, SeatInfo, Toaster } from '../../components';
import service from '../../service';
import { useCountSeats, useSeats } from '../../shared/hooks';
import socket from '../../socket';
import styles from './index.module.scss';
// import mock from './mock.json';

const Home = () => {
  const [seats, setSeats, modifySeats] = useSeats();
  const { activeSeats, totalSeats } = useCountSeats(seats);

  useEffect(() => {
    socket.on('chat', (data) => {
      modifySeats(data);
    });
  }, []);

  useEffect(() => {
    // setSeats(mock);
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
      <Toaster />
    </>
  );
};

export default Home;
