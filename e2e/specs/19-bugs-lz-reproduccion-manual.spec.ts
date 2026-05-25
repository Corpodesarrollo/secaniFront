/**
 * Reproduccion paso a paso bugs persistentes con screenshots para validar
 * que entendemos lo que QA reporta vs lo que fix realmente cubre.
 * SECANI_URL=http://18.232.27.199:9110 npx playwright test specs/19-bugs-lz-reproduccion-manual.spec.ts
 */
import { test, expect } from '../fixtures/auth-qa';

test.describe('BUG-LZ-018 Reproduccion: crear contacto → Histórico NNA', () => {
  test('Flujo completo: ¿hay pantalla que muestra el cambio?', async ({ page, loginAsQA }) => {
    await loginAsQA('agente');
    await page.screenshot({ path: 'e2e/screenshots-bugs/018-01-login.png' });

    // Paso 1: ir a Histórico NNA (pantalla que QA menciona)
    await page.goto('/usuarios/historico_nna', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    await page.screenshot({ path: 'e2e/screenshots-bugs/018-02-historico-nna.png', fullPage: true });

    // ¿La pantalla muestra cambios de contactos? Listamos secciones visibles
    const headings = await page.locator('h1, h2, h3').allTextContents();
    const links = await page.locator('a, button').allTextContents();
    console.log('[BUG-018] Headings:', headings);
    console.log('[BUG-018] Buttons/Links sample:', links.slice(0, 20));

    // Validacion: ¿existe columna o sección "actividad"?
    const tieneActividad = (await page.getByText(/actividad|histori.l|trazabili|cambio/i).count()) > 0;
    console.log('[BUG-018] Pantalla muestra actividad de cambios:', tieneActividad);
    // No assert duro: solo documentar
  });
});

test.describe('BUG-LZ-027 Reproduccion: historico ContactoEntidad multi-entry', () => {
  test('Editar 2 veces → ver historico → contar entries', async ({ page, loginAsQA }) => {
    await loginAsQA('coordinador');
    await page.goto('/usuarios/externos_et', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('p-table', { timeout: 20000 });
    await page.screenshot({ path: 'e2e/screenshots-bugs/027-01-lista-ET.png', fullPage: true });

    const rowsCount = await page.locator('p-table tbody tr').count();
    if (rowsCount === 0) {
      test.skip(true, 'No hay ETs');
    }

    // Buscar boton "Histórico" en alguna fila
    const histBtn = page.locator('p-table tbody tr').first().locator('button[title*="Histórico" i], button[title*="historico" i], i.pi-history').first();
    if (!(await histBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      // Intentar abrir menu acciones (dropdown ...)
      console.log('[BUG-027] No hay btn directo histórico, probando icon');
    }

    try {
      await histBtn.click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e/screenshots-bugs/027-02-historico-dialog.png', fullPage: true });
      // Contar filas
      const dialogRows = await page.locator('.p-dialog table tbody tr, .p-dialog .p-datatable-tbody tr').count();
      console.log('[BUG-027] Filas en historico dialog:', dialogRows);
    } catch (e) {
      console.log('[BUG-027] No se pudo abrir histórico:', e);
    }
  });
});

test.describe('BUG-LZ-040 Reproduccion: mensaje toast al solicitar seguimiento', () => {
  test('Cuidador solicita seguimiento → ¿se ve toast con mensaje claro?', async ({ page, loginAsQA }) => {
    await loginAsQA('cuidador');
    await page.goto('/seguimientos', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => undefined);
    await page.screenshot({ path: 'e2e/screenshots-bugs/040-01-mis-seguimientos.png', fullPage: true });

    // Click "Solicitar"
    const solicitarBtn = page.getByRole('button', { name: /^solicitar$/i }).first();
    if (!(await solicitarBtn.isVisible({ timeout: 8000 }).catch(() => false))) {
      test.skip(true, 'Boton Solicitar no visible');
    }
    await solicitarBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'e2e/screenshots-bugs/040-02-dialog-solicitar.png', fullPage: true });

    // Llenar form mínimo con doc inexistente
    const tipoSel = page.locator('#tipoIdentificacion');
    if (await tipoSel.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tipoSel.selectOption({ label: 'TI' }).catch(() => {});
    }
    const numId = page.locator('#numeroIdentificacion');
    await numId.fill('9999999999');
    const tel = page.locator('#telefono');
    if (await tel.isVisible({ timeout: 2000 }).catch(() => false)) await tel.fill('3001234567');

    await page.screenshot({ path: 'e2e/screenshots-bugs/040-03-form-lleno.png', fullPage: true });

    // Click final solicitar
    const dialog = page.locator('.p-dialog').first();
    const finalBtn = dialog.locator('.btn-exitoso, button:has-text("Solicitar")').last();
    await finalBtn.click().catch(() => {});
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'e2e/screenshots-bugs/040-04-post-submit.png', fullPage: true });

    // ¿Hay toast visible con mensaje claro?
    const toastText = await page.locator('.p-toast, .p-toast-message').allTextContents();
    console.log('[BUG-040] Toast text:', toastText);

    // ¿O mensaje "Http failure"?
    const httpFailure = await page.getByText(/http failure/i).count();
    console.log('[BUG-040] "Http failure" visible:', httpFailure > 0);

    // ¿O mensaje claro NNA no encontrado?
    const mensajeClaro = await page.getByText(/no se encuentra registrado|debe crearlo en el modulo/i).count();
    console.log('[BUG-040] Mensaje claro visible:', mensajeClaro > 0);
  });
});
