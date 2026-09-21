import { test, expect } from '@playwright/test';
import path from 'path';

test('интеграционный тест: создание заказа', async ({ page }) => {
  // 1. путь к HAR-файлам
  const ingredientsHarPath = path.join(__dirname, 'hars', 'ingredients.har');
  const orderHarPath = path.join(__dirname, 'hars', 'order.har');
  const userHarPath = path.join(__dirname, 'hars', 'user.har');

  // 2. перехватываем запросы к API
  await page.routeFromHAR(ingredientsHarPath, {
    url: '**/api/ingredients',
    notFound: 'abort'
  });

  await page.routeFromHAR(orderHarPath, {
    url: '**/api/orders',
    notFound: 'abort'
  });

  await page.routeFromHAR(userHarPath, {
    url: '**/api/auth/user',
    notFound: 'abort'
  });

  // Подставляем тестовый токен авторизации
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'test-access-token',
      url: 'http://localhost:4000'
    }
  ]);

  // 3. открываем страницу
  await page.goto('/');

  // 4. собираем бургер
  const ingredientCards = page.getByTestId('ingredient-card');
  await expect(ingredientCards.first()).toBeVisible();

  const bunName = 'Краторная булка N-200i';
  const pattyName = 'Биокотлета из марсианской Магнолии';

  const bunCard = ingredientCards.filter({ hasText: bunName }).first();
  await bunCard.getByRole('button', { name: 'Добавить' }).click();

  const pattyCard = ingredientCards.filter({ hasText: pattyName }).first();
  await pattyCard.getByRole('button', { name: 'Добавить' }).click();

  // проверяем состав конструктора
  const constructorBunTop = page.getByTestId('constructor-bun-top');
  const constructorBunBottom = page.getByTestId('constructor-bun-bottom');
  const constructorItems = page.getByTestId('constructor-item');

  await expect(constructorBunTop).toContainText(bunName);
  await expect(constructorBunBottom).toContainText(bunName);
  await expect(constructorItems).toHaveCount(1);
  await expect(constructorItems.filter({ hasText: pattyName })).toHaveCount(1);

  // 5. клик по кнопке оформить заказ
  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });

  await expect(orderButton).toBeEnabled();
  await orderButton.click();

  // 6. проверка: модальное окно открылось и в нем верный номер
  const modalWindow = page.getByTestId('modal-window');
  await expect(modalWindow).toBeVisible({ timeout: 10000 });

  const orderNumber = page.getByTestId('order-number');
  await expect(orderNumber).toHaveText('99999');

  // 7/ проверка: конструктор пуст
  await expect(constructorItems).toHaveCount(0);
  const constructor = page.getByTestId('burger-constructor');
  const emptyBunSlots = constructor.getByTestId('empty-bun-slot');

  await expect(emptyBunSlots).toHaveCount(2);
  await expect(emptyBunSlots.first()).toBeVisible();
  await expect(constructor.getByTestId('empty-filling-slot')).toBeVisible();

  // 8. закрытие модального окна
  const closeButton = page.getByRole('button', {
    name: 'Закрыть модальное окно'
  });
  await closeButton.click();

  // 9. проверка: окно закрыто
  await expect(modalWindow).not.toBeVisible({ timeout: 5000 });
});
