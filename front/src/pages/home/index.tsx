import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useMemo } from 'react';
import {
  AdminDialog,
  AdminRadioDialog,
  DeleteDialog,
  RedeemusDialog,
  ReserveDialog,
  SeatBox,
  SeatInfo,
  Toaster,
} from '../../components';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom } from '../../jotai';
import service from '../../service';
import { useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';
// import mockSeats from './mock.json';

const Home = () => {
  const isMaster = useAtomValue(isMasterAtom);
  const setAdminDialogOpen = useUpdateAtom(adminDialogOpenAtom);
  const setAdminRadioDialogOpen = useUpdateAtom(adminRadioDialogOpenAtom);
  const [seats, setSeats, modifySeats] = useSeats();
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);

  useEffect(() => {
    socket.on('seatList', (data) => {
      modifySeats(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // setSeats(mockSeats);
    service
      .getSeats()
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleEntranceClick = () => {
    if (isMaster) {
      setAdminRadioDialogOpen(true);
      return;
    }
    setAdminDialogOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <span className={styles.text}>강단</span>
          </div>
          <div className={styles.seatContainer}>{renderSeats()}</div>
          <div className={styles.title} onClick={handleEntranceClick}>
            입구
          </div>
        </div>
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
      <Toaster />
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
      <AdminDialog />
      <AdminRadioDialog />
    </>
  );
};

export default Home;
