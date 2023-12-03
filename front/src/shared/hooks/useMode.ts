import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router-dom';
import { isMasterAtom } from '../atoms';

export const useMode = () => {
  const isMaster = useAtomValue(isMasterAtom);
  const location = useLocation();

  const isUserMode = location.pathname === '/';
  const isAdminMode = isMaster && location.pathname === '/admin';
  const isAttendanceMode = isMaster && location.pathname === '/attendance';

  return {
    isUserMode,
    isAdminMode,
    isAttendanceMode,
  };
};
