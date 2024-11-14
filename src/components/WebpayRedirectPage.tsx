import React, { useEffect, useState } from 'react';
import { WebpayRedirectForm } from './WebpayRedirectForm';
import { useLocation, Navigate } from 'react-router-dom';

interface WebpayResponse {
  token: string;
  url: string;
}

const WebpayRedirectPage: React.FC = () => {
  const [webpayData, setWebpayData] = useState<WebpayResponse | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Asume que el token y la URL están en el state de la ruta
    const state = location.state as WebpayResponse;
    if (state && state.token && state.url) {
      setWebpayData(state);
    }
  }, [location.state]);

  // Redirecciona si no hay datos en el estado
  if (!webpayData) {
    return <Navigate to="/" />; // Cambia a la página principal si no se reciben datos
  }

  return <WebpayRedirectForm token={webpayData.token} url={webpayData.url} />;
};

export default WebpayRedirectPage;
