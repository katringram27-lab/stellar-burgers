import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getOrderByNumber,
  selectFeedError,
  selectFeedIsRequested,
  selectOrderData
} from '../../slices/feedSlice';
import { selectIngredients } from '../../slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number, id } = useParams();
  const dispatch = useAppDispatch();
  const orderData = useAppSelector(selectOrderData);
  const ingredients = useAppSelector(selectIngredients);
  const isRequested = useAppSelector(selectFeedIsRequested);
  const error = useAppSelector(selectFeedError);

  const orderNumber = Number(number ?? id);
  useEffect(() => {
    if (Number.isInteger(orderNumber) && orderNumber > 0) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!Number.isInteger(orderNumber) || orderNumber <= 0) {
    return <div>Некорректный номер заказа</div>;
  }

  if (isRequested) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
