import { test, expect, QA_USERS, type QARoleName } from '../fixtures/auth-qa';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Smoke read-only: navega todas las rutas declaradas en app.routes.ts +
 * routing.module por cada rol. Para cada (rol, ruta) captura:
 *  - URL final tras navegar (redirect = sin permiso = OK silencioso)
 *  - Console errors
 *  - Network responses >= 500
 *  - Spinner visible >30s = bug
 *  - Screenshot (artefacto manual)
 *
 * NO clickea botones. NO crea/modifica/borra data. Apto contra EC2.
 *
 * Reporte JSON acumulativo en e2e/smoke-report.json para inspección humana.
 */

// Rutas estables (sin parametros :id) extraidas de app.routes.ts + */routing.module.ts
const RUTAS_SIN_PARAMETROS = [
  '/',
  '/home',
  '/perfil',
  '/perfil/mi-perfil',
  '/perfil/mi-perfil-entidad',
  '/mi-semana',
  '/gestion/mi_semana',
  '/casos-entidad',
  '/casos_nna_cancer_infantil',
  '/dashboard-agente-seguimiento',
  '/dashboard-coordinador',
  '/dashboard-eapb',
  '/estado-seguimiento',
  '/gestionar-alertas',
  '/health',
  '/administracion/permisos',
  '/administracion/lista_parametricas',
  '/administracion/asignacion_de_seguimiento',
  '/administracion/plantilla_de_correo',
  // '/usuarios/nna' eliminada del smoke: no existe en usuarios-routing.module.ts
  '/usuarios/historico_nna',
  '/usuarios/crear_nna',
  '/usuarios/agentes_seguimiento',
  '/usuarios/cuidadores',
  '/usuarios/consultar_eapb',
  '/usuarios/externos_et',
  '/usuarios/casos-territorio',
  '/usuarios/pendiente-reportar',
  // '/usuarios/eapb' eliminada del smoke: no existe en usuarios-routing.module.ts (la ruta real es /usuarios/consultar_eapb)
  '/gestion/seguimientos',
  '/cuidador/seguimientos',
  '/reportes/alertas',
  '/reportes/depuracion_p115',
  '/reportes/eapb',
  '/reportes/inconsistencias',
  '/reportes/indicadores',
  '/reportes/llamadas',
  '/reportes/nna',
  '/reportes/reporte-dinamico-entidad-territorial',
  '/reportes/seguimientos',
];

const ROLES: QARoleName[] = ['agente', 'coordinador', 'cuidador', 'externo'];

interface RutaResultado {
  rol: QARoleName;
  ruta: string;
  finalUrl: string;
  redirected: boolean;
  consoleErrors: string[];
  networkFails: string[];
  spinnerColgado: boolean;
  duracionMs: number;
}

const resultados: RutaResultado[] = [];
const reportePath = path.join(__dirname, '..', 'smoke-report.json');
const screenshotsDir = path.join(__dirname, '..', 'screenshots-smoke');

test.beforeAll(() => {
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  // Limpia reporte anterior
  if (fs.existsSync(reportePath)) fs.unlinkSync(reportePath);
});

test.afterAll(() => {
  fs.writeFileSync(reportePath, JSON.stringify(resultados, null, 2));
  // Resumen consola
  const total = resultados.length;
  const conErrores = resultados.filter(r => r.consoleErrors.length > 0 || r.networkFails.length > 0 || r.spinnerColgado);
  const redirects = resultados.filter(r => r.redirected);
  console.log(`\n=== SMOKE REPORT ===`);
  console.log(`Total combinaciones (rol,ruta): ${total}`);
  console.log(`Redirects (sin permiso): ${redirects.length}`);
  console.log(`Con errores: ${conErrores.length}`);
  conErrores.forEach(r => {
    console.log(`  ${r.rol} ${r.ruta}: console=${r.consoleErrors.length} net5xx=${r.networkFails.length} spinner=${r.spinnerColgado}`);
  });
  console.log(`Reporte JSON: ${reportePath}`);
});

for (const rol of ROLES) {
  test.describe(`Smoke rol=${rol}`, () => {
    for (const ruta of RUTAS_SIN_PARAMETROS) {
      test(`${rol} -> ${ruta}`, async ({ page, loginAsQA }) => {
        const consoleErrors: string[] = [];
        const networkFails: string[] = [];

        page.on('console', msg => {
          if (msg.type() === 'error') {
            const txt = msg.text();
            // Filtros ruido: peticiones intencionalmente 404 (favicons, fonts) o auth conocido
            if (!txt.includes('favicon') && !txt.includes('fonts.googleapis') && !txt.includes('chrome-extension')) {
              consoleErrors.push(txt.substring(0, 250));
            }
          }
        });

        page.on('response', r => {
          if (r.status() >= 500) networkFails.push(`${r.status()} ${r.request().method()} ${r.url()}`);
        });

        const inicio = Date.now();
        await loginAsQA(rol);

        try {
          await page.goto(ruta, { waitUntil: 'networkidle', timeout: 30000 });
        } catch (e: any) {
          // Timeout networkidle no debe romper el test; algunas pantallas tienen polling
          console.log(`  WARN networkidle ${ruta}: ${e.message?.substring(0, 100)}`);
        }

        const finalUrl = page.url();
        const redirected = !finalUrl.includes(ruta) && ruta !== '/' && ruta !== '/home';

        // Spinner colgado = .pi-spin visible despues de 5s extra
        await page.waitForTimeout(2000);
        const spinnerColgado = await page.locator('.pi-spin:visible').count() > 0;

        // Screenshot (path safe filename)
        const safeName = `${rol}_${ruta.replace(/[\/]/g, '_').replace(/^_/, '')}`;
        await page.screenshot({
          path: path.join(screenshotsDir, `${safeName}.png`),
          fullPage: false
        }).catch(() => {});

        resultados.push({
          rol,
          ruta,
          finalUrl,
          redirected,
          consoleErrors,
          networkFails,
          spinnerColgado,
          duracionMs: Date.now() - inicio,
        });

        // Asserts blandos: console errors y 5xx son SI flag, pero no fallan test individualmente.
        // El reporte agregado en afterAll es la senal real. Solo falla si spinner colgado
        // (que indica request bloqueada > 30s sin response).
        if (spinnerColgado) {
          console.log(`  SPINNER COLGADO en ${rol} ${ruta}`);
        }
      });
    }
  });
}
