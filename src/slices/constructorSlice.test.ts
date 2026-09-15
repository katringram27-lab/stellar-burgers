import { describe, it, expect } from '@jest/globals';
import constructorReducer, {
  addConstructorItems,
  removeConstructorItems,
  removeConstructorItemsAll,
  moveUpConstructorItems,
  moveDownConstructorItems,
  initialState,
  IConstructorState
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  const defaultInitialState: IConstructorState = initialState;

  it('должен вернуть состояние по умолчанию при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION_TYPE' };
    const result = constructorReducer(undefined, action);
    expect(result).toEqual(defaultInitialState);
  });

  // 2. простой экшен (добавление ингредиента(не булка))
  it('должен корректно добавлять ингредиент в сборку', () => {
    const ingredient = {
      _id: '123',
      name: 'Котлета',
      type: 'main',
      price: 200,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    const result = constructorReducer(
      defaultInitialState,
      addConstructorItems(ingredient)
    );

    expect(result.constructorItems).toHaveLength(1);
    expect(result.constructorItems[0].name).toBe('Котлета');
    expect(result.constructorItems[0].id).toBeDefined();
  });

  // 3. простой экшен добавление булки(обрабатывается отдельно)
  it('должен корректно добавлять булку', () => {
    const bunIngredient = {
      _id: '456',
      name: 'Булка',
      type: 'bun',
      price: 100,
      proteins: 5,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    const result = constructorReducer(
      defaultInitialState,
      addConstructorItems(bunIngredient)
    );

    expect(result.bun).not.toBeNull();
    expect(result.bun?.name).toBe('Булка');
    expect(result.constructorItems).toHaveLength(0);
  });

  // 4. простой экшен удаление ингредиента
  it('должен корректно удалять ингредиент по ID', () => {
    const state: IConstructorState = {
      bun: null,
      constructorItems: [
        {
          _id: '1',
          id: 'test-id-1',
          name: 'Котлета',
          type: 'main',
          price: 200,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '2',
          id: 'test-id-2',
          name: 'Сыр',
          type: 'main',
          price: 150,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      maxId: 2
    };

    const result = constructorReducer(
      state,
      removeConstructorItems('test-id-1')
    );
    expect(result.constructorItems).toHaveLength(1);
    expect(result.constructorItems[0].name).toBe('Сыр');
  });

  // 5. простой экшен очистка всей сборки (удаление всех)
  it('должен корректно очищать всю сборку', () => {
    const state: IConstructorState = {
      bun: {
        _id: '1',
        id: 'test-id-bun',
        name: 'Булка',
        type: 'bun',
        price: 100,
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      constructorItems: [
        {
          _id: '2',
          id: 'test-id-patty',
          name: 'Котлета',
          type: 'main',
          price: 200,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      maxId: 2
    };

    const result = constructorReducer(state, removeConstructorItemsAll());
    expect(result.bun).toBeNull();
    expect(result.constructorItems).toEqual([]);
  });

  // 6. простой экшен перемещение элемента вверх
  it('должен корректно перемещать элемент вверх по списку', () => {
    const state: IConstructorState = {
      bun: null,
      constructorItems: [
        {
          _id: '1',
          id: 'test-id-1',
          name: 'Котлета',
          type: 'main',
          price: 200,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '2',
          id: 'test-id-2',
          name: 'Сыр',
          type: 'main',
          price: 150,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '3',
          id: 'test-id-3',
          name: 'Помидор',
          type: 'main',
          price: 100,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      maxId: 3
    };

    const result = constructorReducer(
      state,
      moveUpConstructorItems('test-id-2')
    );

    expect(result.constructorItems[0].name).toBe('Сыр');
    expect(result.constructorItems[1].name).toBe('Котлета');
    expect(result.constructorItems[2].name).toBe('Помидор');
  });

  // 7. простой экшен перемещение элемента вниз
  it('должен корректно перемещать элемент вниз по списку', () => {
    const state: IConstructorState = {
      bun: null,
      constructorItems: [
        {
          _id: '1',
          id: 'test-id-1',
          name: 'Котлета',
          type: 'main',
          price: 200,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '2',
          id: 'test-id-2',
          name: 'Сыр',
          type: 'main',
          price: 150,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '3',
          id: 'test-id-3',
          name: 'Помидор',
          type: 'main',
          price: 100,
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      maxId: 3
    };

    const result = constructorReducer(
      state,
      moveDownConstructorItems('test-id-2')
    );

    expect(result.constructorItems[0].name).toBe('Котлета');
    expect(result.constructorItems[1].name).toBe('Помидор');
    expect(result.constructorItems[2].name).toBe('Сыр');
  });
});
