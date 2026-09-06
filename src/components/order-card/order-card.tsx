import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsIsLoading,
  selectIngredientsError
} from '../../slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */
  const ingredients = useAppSelector(selectIngredients);
  const isIngredientsLoading = useAppSelector(selectIngredientsIsLoading);
  const ingredientsError = useAppSelector(selectIngredientsError);
  const orderInfo = useMemo(() => {
    if (isIngredientsLoading || !ingredients.length) {
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: ingredientsInfo.slice(0, maxIngredients),
      remains: Math.max(ingredientsInfo.length - maxIngredients, 0),
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients, isIngredientsLoading]);

  if (isIngredientsLoading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (ingredientsError) {
    return <div>{ingredientsError}</div>;
  }

  if (!orderInfo) {
    return <div>Не удалось сформировать заказ</div>;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
