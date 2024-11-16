import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { PaymentResult } from '../components/MallPaymentResult';
import WebpayRedirectPage from '../components/WebpayRedirectPage';
import { CartProvider } from '../context/CartContext'; // Importa el CartProvider

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <CartProvider>
        <App />
      </CartProvider>
    ),
  },
  {
    path: '/payment/result',
    element: (
      <CartProvider>
        <PaymentResult />
      </CartProvider>
    ),
  },
  {
    path: '/webpay-redirect',
    element: (
      <CartProvider>
        <WebpayRedirectPage />
      </CartProvider>
    ),
  },
]);
