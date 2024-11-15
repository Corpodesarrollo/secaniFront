import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-detalle-nuevo-depurados',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-detalle-nuevo-depurados.component.html',
  styleUrl: './reporte-detalle-nuevo-depurados.component.css'
})
export class ReporteDetalleNuevoDepuradosComponent {
  public reportes: any[] = [];

  ngOnInit(): void {
    this.reportes = [
      {
        fechaNotificacion: new Date(),
        origenReporte: 'SIVIGILA',
        primerNombre: 'Ana',
        segundoNombre: 'Maria',
        primerApellido: 'Ruiz',
        segundoApellido: '',
        diagnostico: 'II. Leucemia mieloide aguda',
        edad: '8 años, 3 meses y 2 días',
        sexo: 'Femenino',
        tipoIdentificacion: 'TI',
        numeroIdentificacion: '1026405821',
        fechaNacimiento: new Date(),
        paisNacimiento: 'Colombia',
        etnia: 'N/A',
        departamentoNacimiento: 'Antioquia',
        ciudadNacimiento: 'Apartadó',
        grupoPoblacional: 'Migrantes',
        departamentoProcedencia: 'Antioquia',
        ciudadProcendencia: 'Apartadó',
        barrioProcedencia: 'Centro',
        areaProcedencia: 'Rural',
        direccionProcedencia: 'calle 15 # 3 - 22, piso 2',
        estrato: 2,
        telefono: 320655188,
        departamentoTratamiento: 'Bogota D.C',
        estadoIngreso: 'Vivo',
        fechaIngreso: new Date(),
        regimen: 'Subsidiado',
        aseguradora: 'EPS Sanitas',
        ips: 'Fundación Hospital de la Misericordia',
        contacto: 'Maria bustamante',
        parentesco: 'Madre',
        correoElectronico: 'mb@gm.com',
        telefonoContacto: '3206554288',
        estado: 'Registrado',
        agenteAsignado: 'Marisol',
      },
    ]
  }
}
