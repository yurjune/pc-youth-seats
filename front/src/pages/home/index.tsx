import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { SeatBox } from '../../components/seat-box';
import { Seat } from '../../shared/models/seat.model';
import styles from './index.module.scss';
import mockData from './mock.json';

const Home = () => {
  const [seats, setSeats] = useState<Record<string, Seat[]>>();

  useEffect(() => {
    setSeats(mockData);
  });

  const renderSeats = () => {
    if (seats == null) {
      return;
    }

    return Object.keys(seats).map((line, idx) => (
      <div key={idx}>
        <div className={styles.line}>
          {seats[line].map((seat, idx) => {
            if (seat.seat_active === 0) {
              return <div key={idx} className={styles.emptyBox} />;
            }

            return <SeatBox key={idx} {...seat} />;
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <br />
      <div className={styles.title}>강단</div>
      <br />
      <div className={styles.seatContainer}>{renderSeats()}</div>
      <br />
      <div className={styles.title}>입구</div>
      <br />
    </div>
  );
};

export default Home;