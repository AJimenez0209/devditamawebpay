import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { MallPaymentResult } from '../components/MallPaymentResult';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/payment/result',
    element: <MallPaymentResult />,
  },
]);