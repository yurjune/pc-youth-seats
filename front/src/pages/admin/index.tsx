import {
  Checkbox,
  DeleteDialog,
  FooterNav,
  Layout,
  Participants,
  RedeemusDialog,
  RenderedSeats,
  ReserveDialog,
  SeatInfo,
  SeatsBody,
  type CheckboxProps,
} from '@components/index';
import api from '@shared/api';
import { isMasterAtom } from '@shared/atoms';
import { useGAEventsTracker, useSeats } from '@shared/hooks';
import type { Seats } from '@shared/models';
import socket from '@shared/socket';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const Admin = () => {
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
    Promise.all([api.getSeats(), api.getLastWeekSeats()])
      .then((data) => {
        setSeats(data[0]);
        setLastWeekSeats(data[1]);
      })
      .catch(console.error);

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
          <div className={styles.checkboxContainer}>
            <Checkbox label='지난 주 좌석보기' checked={checked} onChange={handleCheckboxChange} />
          </div>
        </SeatsBody>
        <FooterNav>
          <div className={styles.info}>
            <SeatInfo />
          </div>
          <Participants seats={currentSeats} />
        </FooterNav>
      </Layout>
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};

export default Admin;
