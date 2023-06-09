import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router-dom';
import { isMasterAtom } from '../atoms';

export const useMode = () => {
  const isMaster = useAtomValue(isMasterAtom);
  const location = useLocation();

  const isUserMode = Boolean(location.pathname === '/');
  const isAdminMode = Boolean(isMaster && location.pathname === '/admin');
  const isAttendanceMode = Boolean(isMaster && location.pathname === '/attendance');

  return {
    isUserMode,
    isAdminMode,
    isAttendanceMode,
  };
};
