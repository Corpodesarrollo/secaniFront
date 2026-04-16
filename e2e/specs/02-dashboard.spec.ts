import { test, expect } from '../fixtures/auth';

test.describe('Dashboard - Agente de Seguimiento', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
    await expect(page.locator('app-dashboard-agente-seguimiento')).toBeVisible({ timeout: 15000 });
  });

  test('Muestra tarjetas de resumen (total casos, registros, alertas)', async ({ page }) => {
    const cards = page.locator('.card, .p-card, app-tarjeta-cabecera, .tarjeta, .dashboard-card, .col-md-3, .col-md-4');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test('Dashboard tiene contenido con datos', async ({ page }) => {
    await page.waitForTimeout(5000);
    const text = await page.textContent('body');
    // Debe haber contenido significativo
    expect(text!.length).toBeGreaterThan(50);
    // Debe tener algún número (estadísticas)
    expect(text).toMatch(/\d+/);
  });
});

test.describe('Dashboard - Coordinador', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('coordinador');
    await expect(page.locator('app-dashboard-coordinador')).toBeVisible({ timeout: 15000 });
  });

  test('Muestra dashboard de coordinador con estadísticas', async ({ page }) => {
    await page.waitForTimeout(3000);
    const text = await page.textContent('app-dashboard-coordinador');
    expect(text?.length).toBeGreaterThan(10);
  });
});

test.describe('Dashboard - EAPB/ET', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('externo');
    await expect(page.locator('app-dashboard-eapb')).toBeVisible({ timeout: 15000 });
  });

  test('Muestra dashboard EAPB con contenido', async ({ page }) => {
    await page.waitForTimeout(3000);
    const text = await page.textContent('app-dashboard-eapb');
    expect(text?.length).toBeGreaterThan(10);
  });
});
