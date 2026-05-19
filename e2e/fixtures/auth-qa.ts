import { test as base, Page } from '@playwright/test';

/**
 * Usuarios QA seedeados en BD EC2 (mismos que /qa-login del front).
 * Usar este fixture para tests E2E corriendo contra http://18.232.27.199:9110
 * (los usuarios reales 2035/12745/etc solo existen en BD local dev).
 */
export const QA_USERS = {
  agente: {
    id: 'qa-agente-001',
    idRol: '14CDDEA5-FA06-4331-8359-036E101C5046',
    alias: 'CC9000000001',
    email: 'qa.agente@secani.test',
    name: 'QA Agente Seguimiento',
    state: true,
    rolCode: ['SECANI-AgenteSeguimiento'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'qa.agente@secani.test',
    enterpriseName: 'QA Agente Seguimiento',
    enterpriseIdentification: '9000000001',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: true,
    isCuidador: false,
    isET: false,
    isEAPB: false,
  },
  coordinador: {
    id: 'qa-coordinador-002',
    idRol: '311882D4-EAD0-4B0B-9C5D-4A434D49D16D',
    alias: 'CC9000000002',
    email: 'qa.coordinador@secani.test',
    name: 'QA Coordinador Admin',
    state: true,
    rolCode: ['SECANI-CoordinadorAdmin'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'qa.coordinador@secani.test',
    enterpriseName: 'QA Coordinador Admin',
    enterpriseIdentification: '9000000002',
    isMinSalud: false,
    isCoordinadorAdmin: true,
    isAgenteSeguimiento: false,
    isCuidador: false,
    isET: false,
    isEAPB: false,
  },
  cuidador: {
    id: 'qa-cuidador-003',
    idRol: '4C4016ED-B56D-4953-B8D3-C6A0A45A3850',
    alias: 'CC9000000003',
    email: 'qa.cuidador@secani.test',
    name: 'QA Cuidador',
    state: true,
    rolCode: ['SECANI-Cuidador'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'qa.cuidador@secani.test',
    enterpriseName: 'QA Cuidador',
    enterpriseIdentification: '9000000003',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: false,
    isCuidador: true,
    isET: false,
    isEAPB: false,
  },
  externo: {
    id: 'qa-externo-004',
    idRol: '88775B35-E8A7-4A73-A603-841C9DB3DBAD',
    alias: 'CC9000000004',
    email: 'qa.externo@secani.test',
    name: 'QA Externo EAPB',
    state: true,
    rolCode: ['SECANI-Externo'],
    enterpriseCode: '',
    enterpriseDeptoCode: '',
    enterpriseEmail: 'qa.externo@secani.test',
    enterpriseName: 'QA Externo EAPB',
    enterpriseIdentification: '9000000004',
    isMinSalud: false,
    isCoordinadorAdmin: false,
    isAgenteSeguimiento: false,
    isCuidador: false,
    isET: true,
    isEAPB: false,
  },
} as const;

export type QARoleName = keyof typeof QA_USERS;

async function loginAsQA(page: Page, role: QARoleName) {
  const userData = QA_USERS[role];
  await page.addInitScript((user) => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === 'user') {
        return originalSetItem.call(this, key, JSON.stringify(user));
      }
      return originalSetItem.call(this, key, value);
    };
    // Pre-cargar user en localStorage por si el componente lo lee antes de cualquier setItem
    try {
      window.localStorage.setItem('user', JSON.stringify(user));
    } catch {}
  }, userData);
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
}

export const test = base.extend<{ loginAsQA: (role: QARoleName) => Promise<void> }>({
  loginAsQA: async ({ page }, use) => {
    await use(async (role: QARoleName) => {
      await loginAsQA(page, role);
    });
  },
});

export { expect } from '@playwright/test';
