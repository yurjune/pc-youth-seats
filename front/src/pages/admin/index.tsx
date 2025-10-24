import {
  DeleteDialog,
  FooterNav,
  Layout,
  Participants,
  RedeemusDialog,
  RenderedSeats,
  ReserveDialog,
  SeatInfo,
  SeatsBody,
  AdminValidateDialog,
} from '@components/index';
import api from '@shared/api';
import { adminValidateDialogOpenAtom, isMasterAtom } from '@shared/atoms';
import { useSeats } from '@shared/hooks/useSeats';
import type { Seats } from '@shared/models/seat.model';
import socket from '@shared/socket';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const Admin = () => {
  const [lastWeekSeats] = useState<Seats>();
  const [absentSeatIds, setAbsentSeatIds] = useState<string[]>([]);
  const [checked] = useState(false);
  const [seats, setSeats, modifySeats] = useSeats();
  const isMaster = useAtomValue(isMasterAtom);

  const setAdminValidateDialogOpen = useUpdateAtom(adminValidateDialogOpenAtom);

  const currentSeats = checked ? lastWeekSeats : seats;

  useEffect(() => {
    if (!isMaster) {
      setAdminValidateDialogOpen(true);
    }
  }, [isMaster, setAdminValidateDialogOpen]);

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
    Promise.all([api.getSeats()])
      .then((data) => {
        setSeats(data[0]);
      })
      .catch(console.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Layout>
        <SeatsBody>
          <RenderedSeats
            seats={currentSeats}
            absentSeatIds={absentSeatIds}
            isLastWeekMode={checked}
          />
          {/* <div className={styles.checkboxContainer}> */}
          {/*   <Checkbox label='지난 주 좌석보기' checked={checked} onChange={handleCheckboxChange} /> */}
          {/* </div> */}
        </SeatsBody>
        <FooterNav>
          <div className={styles.info}>
            <SeatInfo />
          </div>
          <Participants seats={currentSeats} />
        </FooterNav>
      </Layout>

      <AdminValidateDialog />
      <ReserveDialog />
      <DeleteDialog />
      <RedeemusDialog />
    </>
  );
};

export default Admin;
