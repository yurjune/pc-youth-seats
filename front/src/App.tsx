import { Routes, Route, useLocation } from 'react-router-dom';
import Admin from './pages/admin';
import Attendance from './pages/attendance';
import Home from './pages/home';
import { GA_ID, IS_PRODUCTION } from './shared/constants';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (IS_PRODUCTION) {
      ReactGA.initialize(GA_ID ?? '');
    }
  }, []);

  // location 변경 감지시 pageview 이벤트 전송
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='/attendance' element={<Attendance />} />
    </Routes>
  );
};

export default App;
