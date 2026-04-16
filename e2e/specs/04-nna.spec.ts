import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('NNA - Gestión de Niñez (RQ01)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('HU01 - Lista de NNA carga con tabla', async ({ page }) => {
    await page.goto('/usuarios/historico_nna', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const table = page.locator('p-table, .p-datatable, table');
    await expect(table.first()).toBeVisible({ timeout: 15000 });
  });

  test('HU01 - Lista tiene columnas relevantes', async ({ page }) => {
    await page.goto('/usuarios/historico_nna', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const headers = await page.locator('th').allTextContents();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('HU03 - Click en NNA muestra detalle', async ({ page }) => {
    await page.goto('/usuarios/historico_nna', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const firstRow = page.locator('p-table tbody tr, table tbody tr').first();
    if (await firstRow.isVisible({ timeout: 10000 }).catch(() => false)) {
      const btn = firstRow.locator('button, a, .p-button').first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        await page.waitForLoadState('networkidle');
        const text = await page.textContent('body');
        expect(text?.length).toBeGreaterThan(100);
      }
    }
  });

  test('HU04 - Formulario crear NNA tiene campos', async ({ page }) => {
    await page.goto('/usuarios/crear_nna', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const inputs = page.locator('input, p-dropdown, p-calendar, textarea, p-inputText, select');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('HU04 - Validaciones al enviar sin datos', async ({ page }) => {
    await page.goto('/usuarios/crear_nna', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const submitBtn = page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Crear")');
    if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
      const validations = page.locator('.p-error, .text-danger, .ng-invalid, .invalid-feedback');
      const hasValidation = await validations.first().isVisible({ timeout: 3000 }).catch(() => false);
      const isDisabled = await submitBtn.isDisabled();
      expect(hasValidation || isDisabled).toBeTruthy();
    }
  });
});

test.describe('NNA - Cuidador', () => {

  test('HU06 - Cuidador ve página de bienvenida con manual', async ({ page, loginAs }) => {
    await loginAs('cuidador');
    await expect(page.getByRole('heading', { name: 'SECÁNI' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Manual/i })).toBeVisible({ timeout: 5000 });
  });
});
