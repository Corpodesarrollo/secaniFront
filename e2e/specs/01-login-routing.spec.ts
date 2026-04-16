import { test, expect } from '../fixtures/auth';

test.describe('Login y Routing por Rol', () => {

  test('Agente de seguimiento → muestra dashboard de agente', async ({ page, loginAs }) => {
    await loginAs('agente');
    // skipLocationChange=true: la URL no cambia, pero el componente se renderiza
    await expect(page.locator('app-dashboard-agente-seguimiento')).toBeVisible({ timeout: 15000 });
  });

  test('Coordinador Admin → muestra dashboard de coordinador', async ({ page, loginAs }) => {
    await loginAs('coordinador');
    await expect(page.locator('app-dashboard-coordinador')).toBeVisible({ timeout: 15000 });
  });

  test('Cuidador → muestra página de bienvenida SECANI', async ({ page, loginAs }) => {
    await loginAs('cuidador');
    // Cuidador no redirige, se queda en home con banner SECÁNI
    await expect(page.getByRole('heading', { name: 'SECÁNI' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Manual/i })).toBeVisible();
  });

  test('Externo/ET → muestra dashboard EAPB', async ({ page, loginAs }) => {
    await loginAs('externo');
    await expect(page.locator('app-dashboard-eapb')).toBeVisible({ timeout: 15000 });
  });
});
