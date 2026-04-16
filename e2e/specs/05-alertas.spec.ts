import { test, expect } from '../fixtures/auth';
import { waitForLoading } from '../helpers/primeng';

test.describe('Alertas - Gestión (RQ03)', () => {

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('agente');
  });

  test('Consultar alertas - página carga', async ({ page }) => {
    await page.goto('/gestionar-alertas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const content = page.locator('app-alertas-gestionar');
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test('Consultar alertas - tiene tabla o contenido', async ({ page }) => {
    await page.goto('/gestionar-alertas', { waitUntil: 'networkidle' });
    await waitForLoading(page);
    const table = page.locator('p-table, .p-datatable, table');
    const hasTable = await table.isVisible({ timeout: 10000 }).catch(() => false);
    const text = await page.textContent('app-alertas-gestionar');
    expect(hasTable || (text?.length ?? 0) > 10).toBeTruthy();
  });
});

test.describe('Alertas - EAPB/ET (RQ07/RQ09)', () => {

  test('EAPB ve dashboard con contenido de alertas', async ({ page, loginAs }) => {
    await loginAs('externo');
    await expect(page.locator('app-dashboard-eapb')).toBeVisible({ timeout: 15000 });
    const text = await page.textContent('app-dashboard-eapb');
    expect(text?.length).toBeGreaterThan(10);
  });
});
