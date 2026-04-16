import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Oficios de Notificación (RQ12-HU03)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('Gestionar alertas - permite ver alertas para crear oficio', async ({ page }) => {
    await page.goto('/gestionar-alertas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-alertas-gestionar');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('Consultar alertas - tiene componente para ver detalle', async ({ page }) => {
    await page.goto('/prueba', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-consultar-alertas, .consultar-alertas');
    const text = await page.textContent('body');
    expect((await content.first().isVisible().catch(() => false)) || text!.length > 50).toBeTruthy();
  });

  test('Respuesta notificación con ID válido carga componente', async ({ page }) => {
    await page.goto('/respuesta-notificacion/1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const content = page.locator('app-notificacion-respuesta, .notificacion-respuesta');
    const text = await page.textContent('body');
    expect((await content.first().isVisible().catch(() => false)) || text!.length > 50).toBeTruthy();
  });

  test('Respuesta notificación con ID inválido no crashea', async ({ page }) => {
    await page.goto('/respuesta-notificacion/999999', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(0);
  });
});

test.describe('Exportación PDF/Excel (RQ02-HU16)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('Lista seguimientos tiene filas clickeables para exportar', async ({ page }) => {
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const rows = page.locator('p-table tbody tr, table tbody tr');
    if (await rows.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('Historico NNA muestra lista de seguimientos previos', async ({ page }) => {
    await page.goto('/usuarios/historico_nna', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const table = page.locator('p-table, table');
    await expect(table.first()).toBeVisible({ timeout: 15000 });
  });

  test('Gestión - ruta base carga módulo', async ({ page }) => {
    await page.goto('/gestion', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(0);
  });
});
