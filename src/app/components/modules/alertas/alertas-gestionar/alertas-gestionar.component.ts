import { Component } from '@angular/core';
import { apis } from '../../../../models/apis.model';
import { GenericService } from '../../../../services/generic.services';
import { AlertasGestion } from '../../../../models/alertasGestion.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-alertas-gestionar',
  standalone: true,
  imports: [TableModule,CardModule],
  templateUrl: './alertas-gestionar.component.html',
  styleUrl: './alertas-gestionar.component.css'
})
export class AlertasGestionarComponent {

  alertas: AlertasGestion[] = [];
  user: string = 'admin';

  constructor(
    private repos: GenericService
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  CargarDatos() {
    this.repos.get('GestionarAlertas/ConsultarAlertas', `/${this.user}`, apis.seguimiento).subscribe({
      next: (data: any) => {
        this.alertas = data;
      }
    });
  }

  enviarRespuesta(value: any) {
  }
  
  verRespuesta(value: any) {
  }
}
