import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import {
  AdminDialog,
  AdminRadioDialog,
  DeleteDialog,
  Layout,
  Participants,
  RedeemusDialog,
  RenderedSeats,
  ReserveDialog,
  SeatInfo,
  SeatsBody,
} from '../../components';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom } from '../../shared/atoms';
import api from '../../shared/api';
import { useSeats } from '../../shared/hooks';
import socket from '../../socket';
import styles from './index.module.scss';

export const Home = () => {
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);
  const setAdminDialogOpen = useUpdateAtom(adminDialogOpenAtom);
  const setAdminRadioDialogOpen = useUpdateAtom(adminRadioDialogOpenAtom);

  useEffect(() => {
    socket.on('seatList', (data) => {
      modifySeats(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.getSeats().then(setSeats).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEntranceClick = () => {
    if (isMaster) {
      setAdminRadioDialogOpen(true);
    } else {
      setAdminDialogOpen(true);
    }
  };

  return (
    <>
      <Layout>
        <SeatsBody onEntranceClick={handleEntranceClick}>
          <RenderedSeats seats={seats} />
        </SeatsBody>
        <div className={styles.info}>
          <SeatInfo />
        </div>
        <Participants seats={seats} />
      </Layout>
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
      <AdminDialog />
      <AdminRadioDialog />
    </>
  );
};
