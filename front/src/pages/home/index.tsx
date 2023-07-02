import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import {
  AdminDialog,
  AdminRadioDialog,
  DeleteDialog,
  Participants,
  RedeemusDialog,
  ReserveDialog,
  SeatBox,
  SeatInfo,
} from '../../components';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom } from '../../shared/atoms';
import api from '../../shared/api';
import { useSeats } from '../../shared/hooks';
import socket from '../../socket';
import styles from './index.module.scss';
import type { Seats } from '../../shared/models';
// import mockSeats from './mock.json';

export const Home = () => {
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);
  const setAdminDialogOpen = useUpdateAtom(adminDialogOpenAtom);
  const setAdminRadioDialogOpen = useUpdateAtom(adminRadioDialogOpenAtom);

  useEffect(() => {
    socket.on('seatList', (data) => {
      modifySeats(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // setSeats(mockSeats);
    api
      .getSeats()
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSeats = (seats: Seats | undefined) => {
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

  const handleEntranceClick = () => {
    if (isMaster) {
      setAdminRadioDialogOpen(true);
    } else {
      setAdminDialogOpen(true);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <span className={styles.text}>강단</span>
          </div>
          <div className={styles.seatContainer}>{renderSeats(seats)}</div>
          <div className={styles.title} onClick={handleEntranceClick}>
            입구
          </div>
        </div>
        <div className={styles.info}>
          <SeatInfo />
        </div>
        <Participants seats={seats} />
      </div>
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
      <AdminDialog />
      <AdminRadioDialog />
    </>
  );
};
