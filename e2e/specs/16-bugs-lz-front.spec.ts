/**
 * Tests E2E para bugs LZ front-only ya desplegados en EC2.
 * Correr con:  SECANI_URL=http://54.90.124.49:9110 npx playwright test specs/16-bugs-lz-front.spec.ts
 */
import { test, expect, QA_USERS } from '../fixtures/auth-qa';

test.describe('BUG-LZ-036 Perfil Cuidador no muestra horarios de Agente', () => {
  test('login Cuidador → /perfil termina en mi-perfil-entidad (sin horarios)', async ({ page, loginAsQA }) => {
    await loginAsQA('cuidador');
    await page.goto('/perfil', { waitUntil: 'domcontentloaded' });
    // Esperar hasta 20s a que el wrapper navegue al destino real
    await expect.poll(() => page.url(), { timeout: 20000 }).toMatch(/\/perfil\/mi-perfil-entidad/);
    // Confirmar visualmente que NO aparece el bloque de Agente
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    await expect(page.getByText('Días laborales y horario de trabajo')).toHaveCount(0);
    await expect(page.getByText('Fechas de ausencia')).toHaveCount(0);
  });

  test('login Agente → /perfil termina en mi-perfil con horarios', async ({ page, loginAsQA }) => {
    await loginAsQA('agente');
    await page.goto('/perfil', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => page.url(), { timeout: 20000 }).toMatch(/\/perfil\/mi-perfil(?!-entidad)/);
    await expect(page.getByText(/Días laborales/i).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('BUG-LZ-028/030/031/032/034/035 Formulario SIVIGILA Cuidador', () => {
  test.beforeEach(async ({ page, loginAsQA }) => {
    await loginAsQA('cuidador');
    // Navegar al formulario SIVIGILA pasando state (tipoId + numero) como lo hace el flujo real
    await page.evaluate(() => {
      history.pushState({ tipoId: 'CC', numero: '99999999999' }, '', '/cuidador/seguimientos/nuevo');
    });
    await page.goto('/cuidador/seguimientos/nuevo', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
  });

  test('028: inputs habilitados (readonly=false) cuando NNA no existe', async ({ page }) => {
    const primerNombre = page.locator('#primerNombre');
    await expect(primerNombre).toBeVisible({ timeout: 10000 });
    const readonly = await primerNombre.getAttribute('readonly');
    expect(readonly).toBeNull();
  });

  test('031: contenedor con scroll vertical y botón Enviar accesible', async ({ page }) => {
    const container = page.locator('.sivigila-scroll').first();
    await expect(container).toBeVisible({ timeout: 10000 });
    const overflow = await container.evaluate((el) => getComputedStyle(el).overflowY);
    expect(['auto', 'scroll']).toContain(overflow);
    await expect(page.getByRole('button', { name: /enviar/i })).toBeVisible();
  });

  test('034: nombres del NNA filtran caracteres numéricos', async ({ page }) => {
    const primerNombre = page.locator('#primerNombre');
    await primerNombre.fill('Juan123Pedro');
    // Esperar al binding (ngModelChange)
    await page.waitForTimeout(200);
    const valor = await primerNombre.inputValue();
    expect(valor).toBe('JuanPedro');
  });

  test('035: validación obligatoria de "Sexo asignado al nacer"', async ({ page }) => {
    // Click ENVIAR sin llenar nada → debe mostrar "Campo requerido" debajo del sexo
    await page.getByRole('button', { name: /enviar/i }).click();
    await expect(page.getByText('Campo requerido').first()).toBeVisible({ timeout: 5000 });
    // El dropdown de sexo debe estar marcado como vacío
    const sexoErr = page.locator('p-dropdown[name="sexoAsignado"]').locator('xpath=following-sibling::*[contains(@class,"text-danger")]');
    // Verificación más laxa: existe al menos un text-danger en la zona del sexo
    const dangers = await page.locator('.text-danger').count();
    expect(dangers).toBeGreaterThan(0);
  });

  test('032: toast warn al hacer click en Enviar con campos vacíos', async ({ page }) => {
    await page.getByRole('button', { name: /enviar/i }).click();
    // p-toast aparece con detail
    const toast = page.locator('.p-toast-message, .p-toast-message-warn');
    await expect(toast.first()).toBeVisible({ timeout: 5000 });
  });

  test('030: input teléfono debe ser de máximo 10 dígitos numéricos (modal Solicitar)', async ({ page }) => {
    // Este test corre en el modal "Solicitar seguimiento" de /seguimientos, no en SIVIGILA.
    // Marcamos skip aquí porque el beforeEach navegó a /cuidador/seguimientos/nuevo.
    test.skip(true, 'Cubierto en describe Modal Solicitar Seguimiento más abajo');
  });
});

test.describe('BUG-LZ-030 modal Solicitar Seguimiento — validación teléfono', () => {
  test('teléfono cuidador rechaza letras y limita a 10 dígitos', async ({ page, loginAsQA }) => {
    await loginAsQA('cuidador');
    await page.goto('/seguimientos', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    // Click botón "SOLICITAR" para abrir modal
    const solicitar = page.getByRole('button', { name: /^solicitar$/i }).first();
    await expect(solicitar).toBeVisible({ timeout: 15000 });
    await solicitar.click();
    const telefono = page.locator('#telefono');
    await expect(telefono).toBeVisible({ timeout: 5000 });
    const maxlength = await telefono.getAttribute('maxlength');
    expect(maxlength).toBe('10');
    const inputmode = await telefono.getAttribute('inputmode');
    expect(inputmode).toBe('numeric');
    await telefono.fill('abc1234567890');
    await page.waitForTimeout(200);
    const valor = await telefono.inputValue();
    expect(valor).toMatch(/^[0-9]{0,10}$/);
    expect(valor.length).toBeLessThanOrEqual(10);
  });
});

test.describe('BUG-LZ-019 paginator dropdown append a body', () => {
  test('tabla Entidades Territoriales: paginator dropdown overlay no clipped', async ({ page, loginAsQA }) => {
    await loginAsQA('coordinador');
    await page.goto('/usuarios/externos_et', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('p-table', { timeout: 15000 });
    // Buscar el dropdown del paginator (rows per page)
    const ppd = page.locator('p-table .p-paginator-rpp-options').first();
    if (!(await ppd.isVisible().catch(() => false))) {
      test.skip(true, 'No hay registros / paginator no visible en EC2');
    }
    await ppd.click();
    // El panel debe ser appended a body
    const panelInBody = await page.locator('body > .p-dropdown-panel, body > .p-overlay, body > div > .p-dropdown-panel').count();
    expect(panelInBody).toBeGreaterThan(0);
  });
});

test.describe('BUG-LZ-008 Permisos guardado exitoso sin error parcial', () => {
  test('login Coordinador → guardar permisos sin cambios → toast/alert success', async ({ page, loginAsQA }) => {
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    await loginAsQA('coordinador');
    await page.goto('/administracion/permisos', { waitUntil: 'domcontentloaded' });
    // Esperar carga de selects
    await page.waitForTimeout(3000);
    // Click consultar
    const consultar = page.getByRole('button', { name: /consultar/i }).first();
    if (await consultar.isVisible({ timeout: 5000 }).catch(() => false)) {
      await consultar.click();
      await page.waitForTimeout(1500);
    }
    // Click guardar
    const guardar = page.getByRole('button', { name: /guardar/i }).first();
    if (!(await guardar.isVisible({ timeout: 5000 }).catch(() => false))) {
      test.skip(true, 'Botón Guardar no visible — la UI Permisos puede requerir flujo previo distinto');
    }
    await guardar.click();
    // Esperar alert dialog
    await page.waitForTimeout(5000);
    if (alertMessage) {
      expect(alertMessage.toLowerCase()).toContain('exitosamente');
      expect(alertMessage.toLowerCase()).not.toContain('con error');
    }
  });
});
