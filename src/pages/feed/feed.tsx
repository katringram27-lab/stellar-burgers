import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getFeeds,
  selectFeed,
  selectFeedError,
  selectFeedIsRequested,
  setFeed
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useAppSelector(selectFeed);
  const dispatch = useAppDispatch();
  const isRequested = useAppSelector(selectFeedIsRequested);
  const error = useAppSelector(selectFeedError);
  const [socketError, setSocketError] = useState('');

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let isUnmounted = false;

    const connect = () => {
      socket = new WebSocket('wss://norma.education-services.ru/orders/all');

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.success) {
            dispatch(setFeed(data));
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
        socket?.close();
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

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
