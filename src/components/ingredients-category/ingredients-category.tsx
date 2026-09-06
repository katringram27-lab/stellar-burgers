import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '../../services/store';
import { selectItems, selectBun } from '../../slices/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  const constructorItems = useAppSelector(selectItems);
  const bun = useAppSelector(selectBun);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    constructorItems.forEach((item) => {
      const apiId =
        (item as any)._id ??
        (item as any).id ??
        (item as any).originalId ??
        (item as any).ingredient?._id;
      if (!apiId) return;
      counters[apiId] = (counters[apiId] || 0) + 1;
    });
    if (bun) {
      const apiId = (bun as any)._id ?? (bun as any).id;
      if (apiId) {
        counters[apiId] = (counters[apiId] || 0) + 1;
      }
    }
    return counters;
  }, [constructorItems, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
