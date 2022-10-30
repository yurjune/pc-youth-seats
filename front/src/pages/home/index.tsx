import { Button } from '@mui/material';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useMemo } from 'react';
import {
  AdminDialog,
  DeleteDialog,
  EuodiaDialog,
  ReserveDialog,
  SearchDialog,
  SeatBox,
  SeatInfo,
  Toaster,
} from '../../components';
import { adminDialogOpenAtom, searchDialogOpenAtom } from '../../jotai';
import service from '../../service';
import { useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';

const Home = () => {
  const [seats, setSeats, modifySeats] = useSeats();
  const setAdminDialogOpen = useUpdateAtom(adminDialogOpenAtom);
  const setSearchDialogOpen = useUpdateAtom(searchDialogOpenAtom);
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);

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

  const handleSearchButtonClick = () => {
    setSearchDialogOpen(true);
  };

  const handleEntranceClick = () => {
    setAdminDialogOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <Button onClick={handleSearchButtonClick} className={styles.searchButton}>
            내 좌석 찾기
          </Button>
          <span className={styles.text}>강단</span>
        </div>
        <div className={styles.seatContainer}>{renderSeats()}</div>
        <div className={styles.title} onClick={handleEntranceClick}>
          입구
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
      <ReserveDialog />
      <DeleteDialog />
      <EuodiaDialog />
      <AdminDialog />
      <SearchDialog />
      <Toaster />
    </>
  );
};

export default Home;
