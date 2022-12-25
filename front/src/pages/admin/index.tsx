import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog, RedeemusDialog, ReserveDialog, SeatBox, SeatInfo, Toaster } from '../../components';
import { Checkbox } from '../../components/checkbox';
import { isMasterAtom } from '../../jotai';
import service from '../../service';
import { useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';
import type { CheckboxProps } from '../../components/checkbox';
import { Seats } from '../../shared/models';
import clsx from 'clsx';

const Admin = () => {
  const isMaster = useAtomValue(isMasterAtom);
  const [seats, setSeats, modifySeats] = useSeats();
  const [lastWeekSeats, setLastWeekSeats] = useState<Seats>();
  const [lastWeekCheckboxChecked, setLastWeekCheckboxChecked] = useState(false);
  const navigate = useNavigate();

  const { activeSeats, totalSeats } = useMemo(() => {
    if (lastWeekCheckboxChecked) {
      return getNumberOfSeats(lastWeekSeats);
    }

    return getNumberOfSeats(seats);
  }, [lastWeekCheckboxChecked, seats, lastWeekSeats]);

  useEffect(() => {
    if (!isMaster) {
      alert('잘못된 접근입니다. 예약화면으로 돌아갑니다');
      navigate('/');
    }
  }, [navigate, isMaster]);

  useEffect(() => {
    socket.on('seatList', (data) => {
      modifySeats(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    service
      .getSeats()
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));

    service
      .getLastWeekSeats()
      .then((data) => setLastWeekSeats(data))
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

            return <SeatBox key={idx} seat={seat} seatLine={line} isLastWeekMode={lastWeekCheckboxChecked} />;
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  const handleLastWeekCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setLastWeekCheckboxChecked(e.target.checked);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <span className={styles.text}>강단</span>
          </div>
          <div className={styles.seatContainer}>{renderSeats(lastWeekCheckboxChecked ? lastWeekSeats : seats)}</div>
          <Checkbox
            label='지난 주 좌석보기'
            checked={lastWeekCheckboxChecked}
            onChange={handleLastWeekCheckboxChange}
          />
          <div className={styles.title}>입구</div>
        </div>
        <div className={styles.info}>
          <SeatInfo />
        </div>
        <div className={styles.count}>
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
    </>
  );
};

export default Admin;
