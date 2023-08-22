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
import { useSeats } from '@shared/hooks';
import socket from '@shared/socket';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

export const Attendance = () => {
  const [lateSeatIds, setLateSeatIds] = useState<string[]>([]);
  const [absentSeatIds, setAbsentSeatIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);
  const navigate = useNavigate();

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

    socket.emit('showLateSeats');
    socket.emit('showAbsentSeats');

    socket.on('lateSeatList', (data) => {
      setLateSeatIds(data);
    });
    socket.on('absentSeatList', (data) => {
      setAbsentSeatIds(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.getSeats().then(setSeats).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <>
      <Layout>
        <SeatsBody>
          <RenderedSeats
            seats={seats}
            lateSeatIds={lateSeatIds}
            absentSeatIds={absentSeatIds}
            isAbsentMode={checked}
          />
          <Checkbox label='미출석자 수정하기' checked={checked} onChange={handleCheckboxChange} />
        </SeatsBody>
        <FooterNav>
          <div className={styles.info}>
            <SeatInfo />
          </div>
          <Participants seats={seats} />
        </FooterNav>
      </Layout>
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};
