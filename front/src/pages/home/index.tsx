import { useEffect, useState } from 'react';
import { DeleteDialog, EuodiaDialog, ReserveDialog, SeatBox, SeatInfo } from '../../components';
import service from '../../service';
import { Seat } from '../../shared/models';
import socket from '../../socket';
import styles from './index.module.scss';
import mock from './mock.json';

const Home = () => {
  const [seats, setSeats] = useState<Record<string, Seat[]>>();
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [euodiaDialogOpen, setEuodiaDialogOpen] = useState(false);

  useEffect(() => {
    socket.on('chat', (data) => {
      console.log('data:', data);
    });
  }, []);

  useEffect(() => {
    // service.getSeats().then((res) => setSeats(res));
    setSeats(mock);
  }, []);

  const renderSeats = () => {
    if (seats == null) {
      return;
    }

    return Object.keys(seats).map((line, idx) => (
      <div key={idx}>
        <div className={styles.line}>
          {seats[line].map((seat, idx) => {
            let handleSeatClick;

            if (seat.seat_active === 0) {
              return <div key={idx} className={styles['active-0']} />;
            }
            if (seat.seat_active === 1) {
              handleSeatClick = () => setReserveDialogOpen(true);
            }
            if (seat.seat_active === 4 && seat.name === '') {
              handleSeatClick = () => setEuodiaDialogOpen(true);
            }
            if (seat.seat_active === 5) {
              handleSeatClick = () => setDeleteDialogOpen(true);
            }

            return <SeatBox key={idx} {...seat} onClick={handleSeatClick} />;
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
      <ReserveDialog open={reserveDialogOpen} onClose={() => setReserveDialogOpen(false)} />
      <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} />
      <EuodiaDialog open={euodiaDialogOpen} onClose={() => setEuodiaDialogOpen(false)} />
    </>
  );
};

export default Home;
