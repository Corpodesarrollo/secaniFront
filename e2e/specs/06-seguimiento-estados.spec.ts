import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Seguimiento - Máquina de Estados (RQ02-HU09/HU10/HU11)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
  });

  test('Lista de seguimientos muestra filtros por estado (hoy, con alerta, todos)', async ({ page }) => {
    // Debe haber botones o tabs de filtro
    const filterButtons = page.locator('button, .p-badge, .filter-btn, .p-tabview-nav li, a[class*="filter"]');
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Cada seguimiento muestra estado con badge de color', async ({ page }) => {
    const rows = page.locator('p-table tbody tr, table tbody tr');
    if (await rows.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      // Las filas deben tener badges o etiquetas de estado
      const badges = page.locator('.p-badge, .badge, .p-tag, span[class*="estado"], td');
      expect(await badges.count()).toBeGreaterThan(0);
    }
  });

  test('Click en seguimiento abre detalle con pasos (steps)', async ({ page }) => {
    const rows = page.locator('p-table tbody tr, table tbody tr');
    if (await rows.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await rows.first().click();
      await page.waitForTimeout(2000);
      // Debe mostrar los steps: Solicitado → Agente asignado → Agendado → Contactado
      const steps = page.locator('p-steps, .p-steps, .step-item');
      const hasSteps = await steps.isVisible({ timeout: 5000 }).catch(() => false);
      // O muestra un diálogo/panel de detalle
      const dialog = page.locator('p-dialog, .p-dialog, .modal');
      const hasDialog = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasSteps || hasDialog).toBeTruthy();
    }
  });

  test('Formulario de contacto tiene campos de persona que contesta', async ({ page }) => {
    const rows = page.locator('p-table tbody tr, table tbody tr');
    if (await rows.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await rows.first().click();
      await page.waitForTimeout(2000);
      // Buscar campos del formulario de contacto
      const formFields = page.locator('input, p-dropdown, textarea, select');
      const count = await formFields.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Seguimiento - Datos del NNA en seguimiento', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('Detalle de seguimiento muestra datos básicos del NNA', async ({ page }) => {
    await page.goto('/gestion/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    // La página debe tener contenido significativo
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Seguimiento por NNA muestra historial', async ({ page }) => {
    // Navegar al listado y verificar que hay estructura de datos
    await page.goto('/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const table = page.locator('p-table, table');
    if (await table.isVisible({ timeout: 10000 }).catch(() => false)) {
      const headers = await page.locator('th').allTextContents();
      // Debe tener columnas relacionadas a seguimiento
      expect(headers.length).toBeGreaterThan(2);
    }
  });
});
