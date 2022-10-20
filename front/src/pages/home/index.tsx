import { useAtomValue } from 'jotai/utils';
import { useEffect, useState } from 'react';
import { DeleteDialog, EuodiaDialog, ReserveDialog, SeatBox, SeatInfo, Toaster } from '../../components';
import { selectedSeatAtom } from '../../jotai';
import service from '../../service';
import { Seats } from '../../shared/models';
import socket from '../../socket';
import styles from './index.module.scss';
// import mock from './mock.json';

const Home = () => {
  const selectedSeat = useAtomValue(selectedSeatAtom);
  const [seats, setSeats] = useState<Seats>();

  useEffect(() => {
    socket.on('chat', (data) => {
      console.log('data:', data);
    });
  }, []);

  useEffect(() => {
    console.log('selectedSeat', selectedSeat);
  }, [selectedSeat]);

  useEffect(() => {
    // setSeats(mock);
    service.getSeats().then((data) => setSeats(data));
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

            return <SeatBox key={idx} seat={seat} />;
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
        <div className={styles.participant}>
          <span>좌석 현황: </span>
          <strong>10</strong>
          <span> / </span>
          <strong>100</strong>
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
