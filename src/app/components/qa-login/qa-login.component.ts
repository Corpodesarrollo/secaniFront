import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface QAUser {
  id: string;
  idRol: string;
  alias: string;
  email: string;
  name: string;
  state: boolean;
  rolCode: string[];
  enterpriseCode: string;
  enterpriseDeptoCode: string;
  enterpriseEmail: string;
  enterpriseName: string;
  enterpriseIdentification: string;
  isMinSalud: boolean;
  isCoordinadorAdmin: boolean;
  isAgenteSeguimiento: boolean;
  isCuidador: boolean;
  isET: boolean;
  isEAPB: boolean;
}

interface RoleOption {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  user: QAUser;
}

@Component({
  selector: 'app-qa-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qa-login.component.html',
  styleUrl: './qa-login.component.css'
})
export class QaLoginComponent {
  roles: RoleOption[] = [
    {
      key: 'agente',
      label: 'Agente de Seguimiento',
      description: 'QA Agente - CC9000000001',
      icon: 'pi-user',
      color: '#3b82f6',
      user: {
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
      }
    },
    {
      key: 'coordinador',
      label: 'Coordinador Admin',
      description: 'QA Coordinador - CC9000000002',
      icon: 'pi-users',
      color: '#8b5cf6',
      user: {
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
      }
    },
    {
      key: 'cuidador',
      label: 'Cuidador',
      description: 'QA Cuidador - CC9000000003',
      icon: 'pi-heart',
      color: '#ec4899',
      user: {
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
      }
    },
    {
      key: 'externo',
      label: 'Externo / EAPB / ET',
      description: 'QA Externo - CC9000000004',
      icon: 'pi-building',
      color: '#10b981',
      user: {
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
      }
    },
    {
      key: 'agente2',
      label: 'Agente de Seguimiento 2',
      description: 'QA Agente 2 - CC9000000005',
      icon: 'pi-user',
      color: '#0ea5e9',
      user: {
        id: 'qa-agente-005',
        idRol: '14CDDEA5-FA06-4331-8359-036E101C5046',
        alias: 'CC9000000005',
        email: 'qa.agente2@secani.test',
        name: 'QA Agente Seguimiento 2',
        state: true,
        rolCode: ['SECANI-AgenteSeguimiento'],
        enterpriseCode: '',
        enterpriseDeptoCode: '',
        enterpriseEmail: 'qa.agente2@secani.test',
        enterpriseName: 'QA Agente Seguimiento 2',
        enterpriseIdentification: '9000000005',
        isMinSalud: false,
        isCoordinadorAdmin: false,
        isAgenteSeguimiento: true,
        isCuidador: false,
        isET: false,
        isEAPB: false,
      }
    }
  ];

  currentUser: string | null = null;

  constructor(private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        this.currentUser = `${u.name} (${u.alias})`;
      } catch {}
    }
  }

  loginAs(role: RoleOption) {
    localStorage.setItem('user', JSON.stringify(role.user));
    window.location.href = '/';
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    window.location.reload();
  }
}
