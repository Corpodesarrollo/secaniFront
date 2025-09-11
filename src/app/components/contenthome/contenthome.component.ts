import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SpinnerComponent } from '../modules/shared/spinner/spinner.component';
import { TarjetaCabeceraComponent } from '../modules/shared/tarjeta-cabecera/tarjeta-cabecera.component';
import { CommonModule } from '@angular/common';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-contenthome',
  templateUrl: './contenthome.component.html',
  styleUrls: ['./contenthome.component.css'],
  standalone: true,
  imports: [TarjetaCabeceraComponent, SpinnerComponent, CommonModule]
})

export class ContenthomeComponent implements OnInit {
  usuario: any = "Invitado";
  cargado = false;
  xUser = new User();
  constructor(public router: Router) { }
  ngOnInit() {
    if (this.xUser.id != null) {
      this.usuario = this.xUser.name;
      if (this.xUser.isCoordinadorAdmin) {
        this.router.navigate(['dashboard-coordinador'], { skipLocationChange: true });
      }
      if (this.xUser.isAgenteSeguimiento) {
        this.router.navigate(['dashboard-agente-seguimiento'], { skipLocationChange: true });
      }
      if (this.xUser.isET || this.xUser.isEAPB) {
        this.router.navigate(['dashboard-eapb'], { skipLocationChange: true });
      }
    } else{
      window.location.href = environment.url_Sispro;
    }
    this.cargado = true;
  }

}
