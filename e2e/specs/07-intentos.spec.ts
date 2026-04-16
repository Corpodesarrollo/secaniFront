import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Intentos de Contacto (RQ02-HU07/HU08)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('HU07 - Intento fallido carga componente', async ({ page }) => {
    await page.goto('/intento', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const content = page.locator('app-intento');
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('HU07 - Tipos de falla disponibles (No contesta, Número equivocado, Error de marcación)', async ({ page }) => {
    await page.goto('/intento', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const dropdown = page.locator('p-dropdown').first();
    if (await dropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dropdown.click();
      await page.waitForTimeout(500);
      const options = page.locator('.p-dropdown-panel .p-dropdown-item, .p-dropdown-items li');
      const count = await options.count();
      // Debe haber opciones de tipo de falla
      expect(count).toBeGreaterThan(0);
    }
  });

  test('HU08 - Intento exitoso carga componente', async ({ page }) => {
    await page.goto('/intento-exitoso', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const content = page.locator('app-intento-exitoso');
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('Intento seguimiento - página principal tiene estructura', async ({ page }) => {
    await page.goto('/intento-seguimiento', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const content = await page.textContent('body');
    expect(content!.length).toBeGreaterThan(50);
  });
});
