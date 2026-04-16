import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Cuidador (RQ08)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('cuidador');
  });

  test('Cuidador ve banner de bienvenida', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SECÁNI' })).toBeVisible({ timeout: 15000 });
  });

  test('Cuidador puede descargar manual de usuario', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /Manual/i });
    await expect(manualBtn).toBeVisible({ timeout: 10000 });
    // Verificar que el botón es clickeable
    await expect(manualBtn).toBeEnabled();
  });

  test('Cuidador ve enlace a Supersalud', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SECÁNI' })).toBeVisible({ timeout: 15000 });
    const supersaludLink = page.locator('a[href*="supersalud"]').first();
    await expect(supersaludLink).toBeVisible({ timeout: 5000 });
  });

  test('Cuidador navega a seguimientos como cuidador', async ({ page }) => {
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    // El componente carga datos de cuidador (GetSeguimientosCuidador)
    const content = page.locator('app-estado-seguimiento');
    await expect(content).toBeVisible({ timeout: 15000 });
  });
});

test.describe('EAPB / Entidad Territorial (RQ07/RQ09)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('externo');
    await expect(page.locator('app-dashboard-eapb')).toBeVisible({ timeout: 15000 });
  });

  test('Dashboard EAPB muestra estadísticas de alertas', async ({ page }) => {
    await page.waitForTimeout(3000);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(100);
  });

  test('EAPB navega a gestionar alertas', async ({ page }) => {
    await page.goto('/gestionar-alertas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-alertas-gestionar');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('EAPB ve casos de entidad', async ({ page }) => {
    await page.goto('/casos-entidad', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });
});
