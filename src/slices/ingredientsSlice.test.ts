import { describe, it, expect } from '@jest/globals';
import ingredientsSlice from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  // 1. проверка на неизвестный экшен (initial state undefined)
  const defaultInitialState = {
    items: [],
    isLoading: true,
    error: null
  };
  it('должен вернуть состояние по умолчанию при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION_TYPE' };
    const result = ingredientsSlice(undefined, action);
    expect(result).toEqual(defaultInitialState);
  });
  // 2. проверка pending (загрузка началась)
  it('должен корректно обрабатывать pending состояние', () => {
    const initialState = { items: [], isLoading: false, error: null };
    const action = { type: 'ingredients/fetchIngredients/pending' };
    const result = ingredientsSlice(initialState, action);
    expect(result.isLoading).toBe(true);
  });
  // 3. проверка fulfilled (данные загружены)
  it('должен корректно обрабатывать fulfilled состояние', () => {
    const initialState = { items: [], isLoading: true, error: null };
    const mockData = [{ _id: '1', name: 'Булка', type: 'bun', price: 100 }];
    const action = {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockData
    };

    const result = ingredientsSlice(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.items).toEqual(mockData);
  });
  // 4. проверка rejected (ошибка)
  it('должен корректно обрабатывать rejected состояние', () => {
    const initialState = { items: [], isLoading: true, error: null };
    const action = {
      type: 'ingredients/fetchIngredients/rejected',
      error: { message: 'Network error' }
    };

    const result = ingredientsSlice(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ой, что-то пошло не так...');
  });
});
