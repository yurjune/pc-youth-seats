import { env } from '@shared/constants';
import { Fragment, Suspense, lazy, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes, useLocation } from 'react-router-dom';

const Home = lazy(() => import('@pages/home'));
const Admin = lazy(() => import('@pages/admin'));
const Attendance = lazy(() => import('@pages/attendance'));

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
    <Fragment>
      <Routes>
        <Route
          path='/'
          element={
            <Suspense fallback={<div />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path='/admin'
          element={
            <Suspense fallback={<div />}>
              <Admin />
            </Suspense>
          }
        />
        <Route
          path='/attendance'
          element={
            <Suspense fallback={<div />}>
              <Attendance />
            </Suspense>
          }
        />
      </Routes>
    </Fragment>
  );
};

export default App;
