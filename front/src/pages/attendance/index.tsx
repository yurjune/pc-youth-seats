import {
  AdminValidateDialog,
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
import { adminValidateDialogOpenAtom, isMasterAtom } from '@shared/atoms';
import { useSeats } from '@shared/hooks/useSeats';
import socket from '@shared/socket';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const Attendance = () => {
  const [lateSeatIds, setLateSeatIds] = useState<string[]>([]);
  const [absentSeatIds, setAbsentSeatIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);

  const setAdminValidateDialogOpen = useUpdateAtom(adminValidateDialogOpenAtom);

  useEffect(() => {
    if (!isMaster) {
      setAdminValidateDialogOpen(true);
    }
  }, [isMaster, setAdminValidateDialogOpen]);

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
          <div className={styles.checkboxContainer}>
            <Checkbox label='미출석자 수정하기' checked={checked} onChange={handleCheckboxChange} />
          </div>
        </SeatsBody>
        <FooterNav>
          <div className={styles.info}>
            <SeatInfo />
          </div>
          <Participants seats={seats} />
        </FooterNav>
      </Layout>

      <AdminValidateDialog />
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};

export default Attendance;
