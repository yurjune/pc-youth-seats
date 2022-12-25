import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog, RedeemusDialog, ReserveDialog, SeatBox, SeatInfo, Toaster } from '../../components';
import { isMasterAtom } from '../../jotai';
import service from '../../service';
import { useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';
import { Checkbox } from '../../components/checkbox';
import type { CheckboxProps } from '../../components/checkbox';

const Attendance = () => {
  const isMaster = useAtomValue(isMasterAtom);
  const [seats, setSeats, modifySeats] = useSeats();
  const [absentCheckboxChecked, setAbsentCheckboxChecked] = useState(false);
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(seats), [seats]);
  const navigate = useNavigate();
  const [lateSeatIds, setLateSeatIds] = useState<string[]>([]);
  const [absentSeatIds, setAbsentSeatIds] = useState<string[]>([]);

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
    socket.emit('seatBoxRendered');
    socket.on('lateSeatList', (data) => {
      setLateSeatIds(data);
    });
    socket.on('absentSeatList', (data) => {
      setAbsentSeatIds(data);
    });
  }, []);

  useEffect(() => {
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

            return (
              <SeatBox
                key={idx}
                seat={seat}
                seatLine={line}
                lateSeatIds={lateSeatIds}
                absentSeatIds={absentSeatIds}
                isAbsentMode={absentCheckboxChecked}
              />
            );
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  const handleAbsentCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setAbsentCheckboxChecked(e.target.checked);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <span className={styles.text}>강단</span>
          </div>
          <div className={styles.seatContainer}>{renderSeats()}</div>
          <Checkbox label='미출석자 수정하기' checked={absentCheckboxChecked} onChange={handleAbsentCheckboxChange} />
          <div className={styles.title}>입구</div>
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
    </>
  );
};

export default Attendance;
