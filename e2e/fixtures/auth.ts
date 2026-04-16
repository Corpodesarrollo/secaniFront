import { test as base, Page } from '@playwright/test';

// Usuarios reales de la BD Secani
export const USERS = {
  agente: {
    id: '2035',
    idRol: '',
    alias: 'CC1032654885',
    email: 'mbec@gmail.com',
    name: 'Maria Becerra',
    state: true,
    rolCode: ['SECANI-AgenteSeguimiento'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'mbec@gmail.com',
    enterpriseName: 'Maria Becerra',
    enterpriseIdentification: '1032654885',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: true,
    isCuidador: false,
    isET: false,
    isEAPB: false,
  },
  coordinador: {
    id: '12745',
    idRol: '',
    alias: 'CC12745',
    email: 'CHARLESROCK96@GMAIL.COM',
    name: 'Lena Beck',
    state: true,
    rolCode: ['SECANI-CoordinadorAdmin'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'CHARLESROCK96@GMAIL.COM',
    enterpriseName: 'Lena Beck',
    enterpriseIdentification: '12745',
    isMinSalud: false,
    isCoordinadorAdmin: true,
    isAgenteSeguimiento: false,
    isCuidador: false,
    isET: false,
    isEAPB: false,
  },
  cuidador: {
    id: '17130',
    idRol: '',
    alias: 'CC17130',
    email: 'wmvtqn14@edwass.org',
    name: 'Andrew Wu',
    state: true,
    rolCode: ['SECANI-Cuidador'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'wmvtqn14@edwass.org',
    enterpriseName: 'Andrew Wu',
    enterpriseIdentification: '17130',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: false,
    isCuidador: true,
    isET: false,
    isEAPB: false,
  },
  externo: {
    id: '19344',
    idRol: '',
    alias: 'CC19344',
    email: 'updwvih4@tnmuww.com',
    name: 'Marianne Garner',
    state: true,
    rolCode: ['SECANI-Externo'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'updwvih4@tnmuww.com',
    enterpriseName: 'Marianne Garner',
    enterpriseIdentification: '19344',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: false,
    isCuidador: false,
    isET: true,
    isEAPB: false,
  },
} as const;

export type RoleName = keyof typeof USERS;

/**
 * Inyecta el usuario interceptando localStorage.setItem ANTES de que Angular cargue.
 * El ModuloGuard siempre escribe un usuario hardcodeado en localStorage,
 * así que interceptamos ese setItem y lo reemplazamos con nuestro usuario de test.
 */
async function loginAs(page: Page, role: RoleName) {
  const userData = USERS[role];
  // Interceptar localStorage.setItem('user', ...) para reemplazar con nuestro usuario
  await page.addInitScript((user) => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key: string, value: string) {
      if (key === 'user') {
        // Reemplazar el usuario del guard con el de nuestro test
        return originalSetItem.call(this, key, JSON.stringify(user));
      }
      return originalSetItem.call(this, key, value);
    };
  }, userData);
  await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
}

// Fixture personalizado con loginAs disponible
export const test = base.extend<{ loginAs: (role: RoleName) => Promise<void> }>({
  loginAs: async ({ page }, use) => {
    await use(async (role: RoleName) => {
      await loginAs(page, role);
    });
  },
});

export { expect } from '@playwright/test';
