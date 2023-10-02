import { Fragment, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@pages/home'));
const Admin = lazy(() => import('@pages/admin'));
const Attendance = lazy(() => import('@pages/attendance'));

const App = () => {
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
