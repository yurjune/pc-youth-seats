import { Routes, Route } from 'react-router-dom';
import Admin from './pages/admin';
import Home from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/admin' element={<Admin />} />
    </Routes>
  );
};

export default App;
