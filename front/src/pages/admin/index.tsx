import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog, RedeemusDialog, ReserveDialog, SeatBox, SeatInfo, Checkbox } from '../../components';
import { isMasterAtom } from '../../jotai';
import service from '../../service';
import { useGAEventsTracker, useSeats } from '../../shared/hooks';
import { getNumberOfSeats } from '../../shared/utilities';
import socket from '../../socket';
import styles from './index.module.scss';
import type { CheckboxProps } from '../../components';
import type { Seats } from '../../shared/models';

export const Admin = () => {
  const [lastWeekSeats, setLastWeekSeats] = useState<Seats>();
  const [absentSeatIds, setAbsentSeatIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);
  const navigate = useNavigate();
  const { trackEvent } = useGAEventsTracker();

  const currentSeats = checked ? lastWeekSeats : seats;
  const { activeSeats, totalSeats } = useMemo(() => getNumberOfSeats(currentSeats), [currentSeats]);

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

    socket.emit('showAbsentSeats');

    socket.on('absentSeatList', (data) => {
      setAbsentSeatIds(data);
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

            return (
              <SeatBox key={idx} seat={seat} seatLine={line} absentSeatIds={absentSeatIds} isLastWeekMode={checked} />
            );
          })}
        </div>
        {line === 'seat_line_6' && <br />}
      </div>
    ));
  };

  const handleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      trackEvent('see_last_week_seats');
    }

    setChecked(e.target.checked);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <span className={styles.text}>강단</span>
          </div>
          <div className={styles.seatContainer}>{renderSeats(currentSeats)}</div>
          <Checkbox label='지난 주 좌석보기' checked={checked} onChange={handleCheckboxChange} />
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
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};
