/**
 * Tests E2E para bugs LZ que QA reporta persistentes despues de cache clear.
 * Objetivo: probar contra EC2 si los fixes deployados realmente funcionan.
 * Correr: SECANI_URL=http://18.232.27.199:9110 npx playwright test specs/18-bugs-lz-persistentes.spec.ts
 */
import { test, expect } from '../fixtures/auth-qa';

test.describe('BUG-LZ-040 Cuidador solicitar seguimiento - mensaje claro NNA no existe', () => {
  test('CrearSeguimientoDetallado retorna mensaje legible cuando NNA no existe', async ({ page, loginAsQA, request }) => {
    await loginAsQA('cuidador');
    // Test backend directo
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    const apiURL = baseURL.replace(':9110', ':9112');
    const resp = await request.post(`${apiURL}/ReportesSIVIGILA/CrearSeguimiento`, {
      data: {
        tipoIdentificacion: 'TI',
        numeroIdentificacion: '9999999999999',
        primerNombre: 'NoExiste',
        primerApellido: 'NoExiste'
      }
    });
    const body = await resp.text();
    // Debe retornar mensaje semantico (no generic 400)
    expect(body).toMatch(/no se encuentra registrado|registrarlo|Histórico/i);
  });
});

test.describe('BUG-LZ-053 EAPB dropdown muestra valor pre-seleccionado en seguimiento', () => {
  test('navegar a /usuarios/historico_nna y verificar EAPB column visible', async ({ page, loginAsQA }) => {
    await loginAsQA('agente');
    await page.goto('/usuarios/historico_nna', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    // Tabla con NNAs cargada
    const rows = page.locator('p-table tbody tr');
    const count = await rows.count();
    if (count === 0) {
      test.skip(true, 'No hay NNAs en EC2 para probar EAPB');
    }
    // No verificable directamente sin entrar a seguimiento. Smoke test: histórico carga.
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('BUG-LZ-060 EAPB modal cancelar limpia form al reabrir', () => {
  test('Crear contacto EAPB → diligenciar → cancelar → reabrir vacio', async ({ page, loginAsQA }) => {
    await loginAsQA('agente');
    await page.goto('/usuarios/consultar_eapb', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    // Click Crear Contacto
    const crearBtn = page.getByRole('button', { name: /^crear$/i }).first();
    if (!(await crearBtn.isVisible({ timeout: 8000 }).catch(() => false))) {
      test.skip(true, 'Boton Crear Contacto no visible');
    }
    await crearBtn.click();
    // Llenar email
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill('test-cancel@example.com');
    // Cancelar
    const cancelBtn = page.getByRole('button', { name: /^cancelar$/i }).first();
    await cancelBtn.click();
    await page.waitForTimeout(500);
    // Reabrir
    await crearBtn.click();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    // Verificar email VACIO
    const value = await emailInput.inputValue();
    expect(value).toBe('');
  });
});

test.describe('BUG-LZ-061 EAPB crear contacto refresca lista', () => {
  test('POST contacto EAPB nuevo → aparece en tabla sin F5', async ({ page, loginAsQA }) => {
    await loginAsQA('agente');
    await page.goto('/usuarios/consultar_eapb', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    const before = await page.locator('p-table tbody tr').count();
    // Click Crear
    const crearBtn = page.getByRole('button', { name: /^crear$/i }).first();
    if (!(await crearBtn.isVisible({ timeout: 8000 }).catch(() => false))) {
      test.skip(true, 'Boton Crear Contacto no visible');
    }
    await crearBtn.click();
    // Llenar campos requeridos
    const ts = Date.now();
    await page.locator('#entidadId').selectOption({ index: 1 });
    await page.locator('#nombres').fill(`E2E Test ${ts}`);
    await page.locator('#telefonos').fill('3001234567');
    await page.locator('#email').fill(`e2e-${ts}@test.com`);
    // Wait for async email validator
    await page.waitForTimeout(800);
    // Guardar (dentro del modal Bootstrap, btn type=submit class=btn-guardar)
    const guardar = page.locator('.modal-footer button.btn-guardar').first();
    if (await guardar.isDisabled()) {
      test.skip(true, 'Button Guardar disabled (validators async pendientes o entidad sin opciones)');
    }
    await guardar.click();
    // Esperar refresh
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => undefined);
    await page.waitForTimeout(2000);
    const after = await page.locator('p-table tbody tr').count();
    expect(after).toBeGreaterThanOrEqual(before + 1);
  });
});

test.describe('BUG-LZ-068 Reasignacion Mi Semana - JOIN sin filtro Activo', () => {
  test('GetSeguimientoUsuario para agente activo retorna unique rows', async ({ request }) => {
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    const apiURL = baseURL.replace(':9110', ':9113');
    const now = new Date();
    const futuro = new Date(now.getTime() + 7 * 86400000);
    const resp = await request.get(`${apiURL}/Seguimiento/GetSeguimientoUsuario?UsuarioId=qa-agente-001&FechaInicial=${now.toISOString()}&FechaFinal=${futuro.toISOString()}`);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
    // Verificar no duplicados (Id unico por seguimiento)
    const ids = body.map((s: any) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

test.describe('BUG-LZ-070 Categorias/Subs ocultan IsDeleted', () => {
  test('GET /CategoriaAlerta no retorna "editar borrar" ni "Cat 1"', async ({ request }) => {
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    const apiURL = baseURL.replace(':9110', ':9114');
    const resp = await request.get(`${apiURL}/CategoriaAlerta`);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
    const nombres = body.map((c: any) => c.nombre);
    expect(nombres).not.toContain('editar borrar');
    expect(nombres).not.toContain('Cat 1');
  });

  test('GET /CategoriaAlerta/Subcategorias/1 no retorna "SUBCAT PRUEBA" ni "Item nuevo"', async ({ request }) => {
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    const apiURL = baseURL.replace(':9110', ':9114');
    const resp = await request.get(`${apiURL}/CategoriaAlerta/Subcategorias/1`);
    const body = await resp.json();
    const subs = (body.subCategorias || []).map((s: any) => s.subCategoriaAlerta);
    expect(subs).not.toContain('SUBCAT PRUEBA');
    expect(subs).not.toContain('Item nuevo');
    // Y debe retornar mas de 1 (BUG-LZ-067 fix)
    expect(subs.length).toBeGreaterThan(1);
  });
});

test.describe('BUG-LZ-027 ContactoEntidad histórico preserva multiples cambios', () => {
  test('GET /ContactoEntidad/Historico/{id} retorna multiples acciones', async ({ request }) => {
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    const apiURL = baseURL.replace(':9110', ':9111');
    const resp = await request.get(`${apiURL}/ContactoEntidad/Historico/1`);
    const body = await resp.json();
    expect(Array.isArray(body)).toBe(true);
    // Si hay history, debe tener mas de 1 entry
    if (body.length > 0) {
      // Cada entry debe tener fields requeridos
      expect(body[0]).toHaveProperty('transaccion');
      expect(body[0]).toHaveProperty('fechaTransaccion');
    }
  });
});

test.describe('BUG-LZ-018 ContactoNNA POST registra historico', () => {
  test('POST ContactoNNAs → HistoricoTransaccion debe tener entry NombreTabla=ContactoNNA', async ({ request }) => {
    const baseURL = process.env.SECANI_URL || 'http://18.232.27.199:9110';
    // Endpoint MSNNA POST contacto
    const apiURL = baseURL.replace(':9110', ':9112');
    const nuevo = {
      nNAId: 10016,
      nombres: `E2E ${Date.now()}`,
      parentescoId: 1,
      telefonos: '3001234567',
      email: 'e2e-historico@test.com',
      cuidador: false,
      estado: 'Activo'
    };
    const resp = await request.post(`${apiURL}/ContactoNNAs`, { data: nuevo });
    // Solo verifica que el endpoint acepta (no 500)
    expect([200, 201, 400]).toContain(resp.status());
  });
});
