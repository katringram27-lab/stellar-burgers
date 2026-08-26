import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getOrders,
  selectOrderIsRequested,
  selectOrders,
  selectOrdersError,
  setOrders
} from '../../slices/orderListUserSlice';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const isRequested = useAppSelector(selectOrderIsRequested);
  const error = useAppSelector(selectOrdersError);
  const [socketError, setSocketError] = useState('');

  useEffect(() => {
    if (getCookie('accessToken')) {
      dispatch(getOrders());
    }
  }, [dispatch]);

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return;
    }

    const token = accessToken.replace(/^Bearer\s+/i, '');

    let socket: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let isUnmounted = false;

    const connect = () => {
      socket = new WebSocket(
        `wss://norma.education-services.ru/orders?token=${token}`
      );

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.success) {
            dispatch(setOrders(data.orders));
            setSocketError('');
          }
        } catch (parseError) {
          console.error('Ошибка при разборе данных WebSocket:', parseError);
          setSocketError('Не удалось обработать данные заказов');
        }
      };

      socket.onclose = () => {
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      socket.onerror = () => {
        setSocketError('Ошибка соединения с сервером');
        socket.close();
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimer);

      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close();
      }
    };
  }, [dispatch]);

  if (isRequested) {
    return <Preloader />;
  }

  if (socketError) {
    return <div className='text text_type_main-medium'>{socketError}</div>;
  }
  if (error) {
    return <div className='text text_type_main-medium'>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
