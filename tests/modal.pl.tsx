import { test, expect } from '@playwright/test';
import path from 'path';

test('интеграционный тест: модальные окна ингредиентов', async ({ page }) => {
  // 1. путь к HAR-файлу
  const harPath = path.join(__dirname, 'ingredients.har');

  // 2. настраиваем перехват запроса
  await page.routeFromHAR(harPath, { url: '**/api/ingredients',
    notFound: 'abort'
  });

  // 3. открываем страницу
  await page.goto('/');

  // 4. ждем появления карточек ингредиентов
  const ingredientCards = page.getByTestId('ingredient-card');
  await expect(ingredientCards.first()).toBeVisible();
  await expect(ingredientCards).toHaveCount(15);

  // 6. открытие модального окна ингредиента
  const bunCard = ingredientCards.filter({ hasText: /булка/i }).first();
  await bunCard.click();

  const modalWindow = page.getByTestId('modal-window');
  await expect(modalWindow).toBeVisible({ timeout: 10000 });

  await expect(modalWindow).toHaveText(/булка/i);

  // 7. закрытие по клику на крестик
  const closeButton = page.getByRole('button', { name: 'Закрыть модальное окно' });
  await closeButton.click();
  await expect(modalWindow).not.toBeVisible({ timeout: 5000 });

  // 8. закрытие по клику на оверлей
  await bunCard.click();
  await expect(modalWindow).toBeVisible({ timeout: 5000 });

  const modalOverlay = page.getByTestId('modal-overlay');
  await modalOverlay.click({ position: { x: 5, y: 5 } });
  await expect(modalWindow).not.toBeVisible({ timeout: 5000 });
});
