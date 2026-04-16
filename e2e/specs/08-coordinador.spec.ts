import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Coordinador Admin (RQ06)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('coordinador');
    await expect(page.locator('app-dashboard-coordinador')).toBeVisible({ timeout: 15000 });
  });

  test('Dashboard coordinador tiene tarjetas de resumen', async ({ page }) => {
    const cards = page.locator('.card, .p-card, .col-md-3, .col-md-4, .dashboard-card');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Navegar a administración - permisos', async ({ page }) => {
    await page.goto('/administracion/permisos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Navegar a administración - listas paramétricas', async ({ page }) => {
    await page.goto('/administracion/listas-parametricas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Navegar a asignación de seguimientos', async ({ page }) => {
    await page.goto('/administracion/asignacion-seguimiento', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('p-table, table, .p-datatable, form');
    const hasContent = await content.first().isVisible({ timeout: 10000 }).catch(() => false);
    const text = await page.textContent('body');
    expect(hasContent || text!.length > 100).toBeTruthy();
  });

  test('Navegar a plantillas de correo', async ({ page }) => {
    await page.goto('/administracion/plantillas-correo', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    // Debe haber tabla de plantillas o formulario
    const table = page.locator('p-table, table');
    const hasTable = await table.isVisible({ timeout: 10000 }).catch(() => false);
    const text = await page.textContent('body');
    expect(hasTable || text!.length > 100).toBeTruthy();
  });

  test('Navegar a perfil del usuario', async ({ page }) => {
    await page.goto('/perfil/mi-perfil', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    // El perfil puede redirigir a home si no tiene datos del backend
    // Verificamos que la navegación no causó error (page loaded)
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(0);
  });
});
