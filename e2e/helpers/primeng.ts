import { Page, Locator } from '@playwright/test';

/** Seleccionar opcion de un p-dropdown de PrimeNG */
export async function selectDropdown(page: Page, dropdownSelector: string, optionText: string) {
  const dropdown = page.locator(dropdownSelector);
  await dropdown.click();
  await page.locator('.p-dropdown-panel .p-dropdown-item').filter({ hasText: optionText }).click();
}

/** Seleccionar fecha en p-calendar de PrimeNG */
export async function selectDate(page: Page, calendarSelector: string, day: number) {
  const calendar = page.locator(calendarSelector);
  await calendar.click();
  await page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month) span')
    .filter({ hasText: new RegExp(`^${day}$`) })
    .first()
    .click();
}

/** Obtener filas de un p-table */
export async function getTableRows(page: Page, tableSelector: string = 'p-table'): Promise<Locator> {
  return page.locator(`${tableSelector} tbody tr`);
}

/** Esperar que un p-toast aparezca con cierto mensaje */
export async function waitForToast(page: Page, messageText: string, timeout = 5000) {
  await page.locator('.p-toast-message').filter({ hasText: messageText }).waitFor({ timeout });
}

/** Click en boton dentro de una fila de tabla */
export async function clickRowButton(page: Page, rowIndex: number, buttonSelector: string) {
  await page.locator(`p-table tbody tr`).nth(rowIndex).locator(buttonSelector).click();
}

/** Verificar que un campo esta deshabilitado */
export async function isFieldDisabled(page: Page, selector: string): Promise<boolean> {
  const field = page.locator(selector);
  const disabled = await field.getAttribute('disabled');
  const readonly = await field.getAttribute('readonly');
  const classAttr = await field.getAttribute('class');
  return disabled !== null || readonly !== null || (classAttr?.includes('p-disabled') ?? false);
}

/** Verificar que un campo es requerido (tiene clase ng-invalid o atributo required) */
export async function isFieldRequired(page: Page, selector: string): Promise<boolean> {
  const field = page.locator(selector);
  const required = await field.getAttribute('required');
  const ariaRequired = await field.getAttribute('aria-required');
  return required !== null || ariaRequired === 'true';
}

/** Esperar carga de datos (spinner desaparece) */
export async function waitForLoading(page: Page, timeout = 10000) {
  const spinner = page.locator('.p-progress-spinner, .loading-spinner, .spinner-border');
  if (await spinner.isVisible({ timeout: 1000 }).catch(() => false)) {
    await spinner.waitFor({ state: 'hidden', timeout });
  }
}
