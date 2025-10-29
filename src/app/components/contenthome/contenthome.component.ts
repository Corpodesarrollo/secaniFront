import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SpinnerComponent } from '../modules/shared/spinner/spinner.component';
import { TarjetaCabeceraComponent } from '../modules/shared/tarjeta-cabecera/tarjeta-cabecera.component';
import { CommonModule } from '@angular/common';
import { User } from '../../core/services/user';
import { GenericService } from '../../services/generic.services';
import { apis } from '../../models/apis.model';

@Component({
  selector: 'app-contenthome',
  templateUrl: './contenthome.component.html',
  styleUrls: ['./contenthome.component.css'],
  standalone: true,
  imports: [TarjetaCabeceraComponent, SpinnerComponent, CommonModule]
})

export class ContenthomeComponent implements OnInit {
  cargado = false;
  visible = 'true';
  xUser = new User();
  constructor(public router: Router, public genericService: GenericService) { }
  ngOnInit() {
    if (this.xUser.id != null) {
      if (this.xUser.isCoordinadorAdmin) {
        this.router.navigate(['dashboard-coordinador'], { skipLocationChange: true });
      }
      if (this.xUser.isAgenteSeguimiento) {
        this.router.navigate(['dashboard-agente-seguimiento'], { skipLocationChange: true });
      }
      if (this.xUser.isET || this.xUser.isEAPB) {
        this.router.navigate(['dashboard-eapb'], { skipLocationChange: true });
      }
      if (this.xUser.isCuidador) {
        this.visible = 'false';
      }
    } else{
      window.location.href = environment.url_Sispro;
    }
    this.cargado = true;
  }

  async abrirManual() {
    try {
      let manual = await this.genericService.getFile('Cuidador/DownloadManualCuidador', '', apis.nna);
      const url = URL.createObjectURL(manual);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MANUAL DE USUARIO CUIDADOR.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el manual:', error);
    }
  }
}
