import { test, expect } from '@playwright/test';
import path from 'path';

test('интеграционный тест: kонструктор бургера (с HAR-моком)', async ({
  page
}) => {
  // 1. путь к HAR-файлу
  const harPath = path.join(__dirname, 'ingredients.har');

  // 2. настраиваем перехват запроса
  await page.routeFromHAR(harPath, {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  // 3. открываем страницу
  await page.goto('/');

  // 4. ждем появления карточек ингредиентов
  const ingredientCards = page.getByTestId('ingredient-card');
  await expect(ingredientCards.first()).toBeVisible();
  await expect(ingredientCards).toHaveCount(15);

  // 5. ТЕСТ 1: ДОБАВЛЕНИЕ БУЛКИ (минимальное требование)
  const bunCard = ingredientCards.filter({ hasText: /булка/i }).first();
  await bunCard.getByRole('button', { name: 'Добавить' }).click();

  const constructorItems = page.getByTestId('constructor-item');
  await expect(constructorItems).toHaveCount(0);

  // 6. ТЕСТ 2: ДОБАВЛЕНИЕ КОТЛЕТЫ (идеал: разные типы)
  const pattyCard = ingredientCards.filter({ hasText: /котлета/i }).first();
  await pattyCard.getByRole('button', { name: 'Добавить' }).click();

  await expect(constructorItems).toHaveCount(1);

  // 7. (опционально) проверка цены
  const totalPrice = page.getByTestId('total-price');
  await expect(totalPrice).toHaveText(/\d+/);
});
