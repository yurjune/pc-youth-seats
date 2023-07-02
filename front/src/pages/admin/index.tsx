import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DeleteDialog,
  RedeemusDialog,
  ReserveDialog,
  SeatInfo,
  Checkbox,
  Participants,
  RenderedSeats,
  SeatsBody,
  Layout,
} from '../../components';
import { isMasterAtom } from '../../shared/atoms';
import api from '../../shared/api';
import { useGAEventsTracker, useSeats } from '../../shared/hooks';
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
    api
      .getSeats()
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));

    api
      .getLastWeekSeats()
      .then((data) => setLastWeekSeats(data))
      .catch((error) => console.error(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      trackEvent('see_last_week_seats');
    }

    setChecked(e.target.checked);
  };

  return (
    <>
      <Layout>
        <SeatsBody>
          <RenderedSeats
            seats={currentSeats}
            absentSeatIds={absentSeatIds}
            isLastWeekMode={checked}
          />
          <Checkbox label='지난 주 좌석보기' checked={checked} onChange={handleCheckboxChange} />
        </SeatsBody>
        <div className={styles.info}>
          <SeatInfo />
        </div>
        <Participants seats={currentSeats} />
      </Layout>
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};
