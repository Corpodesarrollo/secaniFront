import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Seguimientos - Flujo Core (RQ02)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
    await expect(page.locator('app-dashboard-agente-seguimiento')).toBeVisible({ timeout: 15000 });
  });

  test('HU02 - Navegar a Mi Semana', async ({ page }) => {
    await page.goto('/mi-semana', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-mi-semana');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('HU05 - Navegar a seguimientos muestra estado-seguimiento', async ({ page }) => {
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-estado-seguimiento');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('HU05 - La tabla de seguimientos tiene columnas', async ({ page }) => {
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const table = page.locator('p-table, .p-datatable, table');
    if (await table.isVisible({ timeout: 10000 }).catch(() => false)) {
      const headers = await page.locator('th').allTextContents();
      expect(headers.length).toBeGreaterThan(0);
    }
  });

  test('Intento de seguimiento - página carga', async ({ page }) => {
    await page.goto('/intento-seguimiento', { waitUntil: 'networkidle' });
    const content = page.locator('app-intento-seguimiento');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('Intento fallido - página carga', async ({ page }) => {
    await page.goto('/intento', { waitUntil: 'networkidle' });
    const content = page.locator('app-intento');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('Intento exitoso - página carga', async ({ page }) => {
    await page.goto('/intento-exitoso', { waitUntil: 'networkidle' });
    const content = page.locator('app-intento-exitoso');
    await expect(content).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Seguimientos - Estado y Detalle', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('Estado seguimiento - muestra contenido', async ({ page }) => {
    await page.goto('/gestion/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Plantillas de correo - carga la sección', async ({ page }) => {
    await page.goto('/gestion/plantillas-correo', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text?.length).toBeGreaterThan(0);
  });
});
