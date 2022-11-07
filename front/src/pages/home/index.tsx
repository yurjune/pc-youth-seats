import { Button } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminDialog,
  AdminRadioDialog,
  DeleteDialog,
  EuodiaDialog,
  ReserveDialog,
  SearchDialog,
  SeatBox,
  SeatInfo,
  Toaster,
} from '../../components';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom, searchDialogOpenAtom } from '../../jotai';
import service from '../../service';
import { useMode, useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';
// import mockSeats from './mock.json';

const Home = () => {
  const setAdminDialogOpen = useUpdateAtom(adminDialogOpenAtom);
  const setAdminRadioDialogOpen = useUpdateAtom(adminRadioDialogOpenAtom);
  const setSearchDialogOpen = useUpdateAtom(searchDialogOpenAtom);
  const isMaster = useAtomValue(isMasterAtom);
  const { isUserMode } = useMode();
  const [seats, setSeats, modifySeats] = useSeats();
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserMode) {
      return;
    }

    if (!isMaster) {
      alert('잘못된 접근입니다. 예약화면으로 돌아갑니다');
      navigate('/');
    }
  }, [navigate, isMaster, isUserMode]);

  useEffect(() => {
    socket.on('chat', (data) => {
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

  const handleSearchButtonClick = () => {
    setSearchDialogOpen(true);
  };

  const handleEntranceClick = () => {
    if (!isUserMode) {
      return;
    }

    if (isMaster) {
      setAdminRadioDialogOpen(true);
      return;
    }

    setAdminDialogOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          {isUserMode && (
            <Button onClick={handleSearchButtonClick} className={styles.searchButton}>
              내 좌석 찾기
            </Button>
          )}
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
      <Toaster />
      <ReserveDialog />
      <DeleteDialog />
      <EuodiaDialog />
      {isUserMode && (
        <>
          <SearchDialog />
          <AdminDialog />
          <AdminRadioDialog />
        </>
      )}
    </>
  );
};

export default Home;
