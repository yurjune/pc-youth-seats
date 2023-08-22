import { Routes, Route, useLocation } from 'react-router-dom';
import { Admin, Attendance, Home } from '@pages/index';
import { env } from '@shared/constants';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { Toaster } from '@components/index';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (env.IS_PRODUCTION) {
      ReactGA.initialize(env.GA_ID ?? '');
    }
  }, []);

  // location 변경 감지시 pageview 이벤트 전송
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/attendance' element={<Attendance />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
