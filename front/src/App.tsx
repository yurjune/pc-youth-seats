import { Routes, Route } from 'react-router-dom';
import Admin from './pages/admin';
import Attendance from './pages/attendance';
import Home from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='/attendance' element={<Attendance />} />
    </Routes>
  );
};

export default App;
