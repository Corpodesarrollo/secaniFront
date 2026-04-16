import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Reportes (RQ05/RQ11)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('coordinador');
  });

  test('Reporte de NNA - carga página', async ({ page }) => {
    await page.goto('/reportes/nna', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Reporte de Seguimientos - carga página', async ({ page }) => {
    await page.goto('/reportes/seguimientos', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Reporte de Alertas - carga página', async ({ page }) => {
    await page.goto('/reportes/alertas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Reporte de Llamadas - carga página', async ({ page }) => {
    await page.goto('/reportes/llamadas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Reporte de Indicadores - carga página', async ({ page }) => {
    await page.goto('/reportes/indicadores', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });

  test('Reporte EAPB - carga página', async ({ page }) => {
    await page.goto('/reportes/eapb', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const text = await page.textContent('body');
    expect(text!.length).toBeGreaterThan(50);
  });
});
