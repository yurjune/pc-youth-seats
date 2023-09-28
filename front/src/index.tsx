import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '@styles/global.scss';
import { ToastProvider } from '@shared/context/ToastContext';

ReactDOM.render(
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
