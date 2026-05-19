import { test, expect } from '../fixtures/auth-qa';

test('BUG-034 verificar filtro numeros nombres SIVIGILA', async ({ page, loginAsQA }) => {
  await loginAsQA('cuidador');
  await page.goto('http://18.232.27.199:9110/cuidador/seguimientos/nuevo?tipoId=TI&numero=999', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  const campos = ['primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido'];
  for (const c of campos) {
    const input = page.locator(`#${c}`);
    if (await input.count() === 0) { console.log(`SKIP ${c} no visible`); continue; }
    await input.fill('Juan123');
    await page.waitForTimeout(300);
    const value = await input.inputValue();
    console.log(`${c}: tipeo "Juan123" -> queda "${value}"`);
  }
});
