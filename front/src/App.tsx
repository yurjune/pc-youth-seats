import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/admin' element={<Home />} />
      <Route path='/attendance' element={<Home />} />
    </Routes>
  );
};

export default App;
