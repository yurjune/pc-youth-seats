import {
  AdminDialog,
  AdminRadioDialog,
  DeleteDialog,
  FooterNav,
  Layout,
  Participants,
  RedeemusDialog,
  RenderedSeats,
  ReserveDialog,
  SeatInfo,
  SeatsBody,
} from '@components/index';
import api from '@shared/api';
import { adminDialogOpenAtom, adminRadioDialogOpenAtom, isMasterAtom } from '@shared/atoms';
import { useSeats } from '@shared/hooks';
import socket from '@shared/socket';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect } from 'react';
import styles from './index.module.scss';

const Home = () => {
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
      <AdminDialog />
      <AdminRadioDialog />
    </>
  );
};

export default Home;
