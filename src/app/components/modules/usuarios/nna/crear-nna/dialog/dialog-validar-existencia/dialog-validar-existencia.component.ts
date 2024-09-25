import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Generico } from '../../../../../../../core/services/generico';
import { environment } from '../../../../../../../../environments/environment';
import { GenericService } from '../../../../../../../services/generic.services';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dialog-validar-existencia',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, FormsModule, ProgressSpinnerModule],
  templateUrl: './dialog-validar-existencia.component.html',
  styleUrls: ['../../../../general.component.css', './dialog-validar-existencia.component.css'],
  encapsulation: ViewEncapsulation.None // Por defecto
})
export class DialogValidarExistenciaComponent {

  @Input() tipoId: any; // Recibir datos del padre
  @Input() numeroId: any; // Recibir datos del padre
  @Output() dataToParentValidarExistencia = new EventEmitter<any>(); // Emitir datos al padre

  constructor(private service: GenericService, private router: Router, private axios: Generico) { }

  visible: boolean = false;
  mostrar = true;

  showDialog() {
    this.visible = true;
  }
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }
  btn_ver_detalle_nna() {
    this.router.navigate(["/usuarios/ver_detalle_nna"]);
  }

  async validarExistencia() {
    this.mostrar = false;
    const baseUrl = environment.url_MsNna;
    if (!this.isEmpty(this.numeroId) && !this.isEmpty(this.tipoId)) {
      const url = `NNA/ConsultarNNAsByTipoIdNumeroId/${this.tipoId}/${this.numeroId}`;

      try {
        const response: any = await this.axios.retorno_get(url, baseUrl);

        //console.log("validarExistencia :: ", response, url);

        if (response && Object.keys(response).length > 0) {
          this.showDialog();
        } else {
          // Handle the case where the response is empty
          //console.log('Response is empty or invalid');
        }

        this.dataToParentValidarExistencia.emit(response); // Ensure this is an EventEmitter
        this.mostrar = true;
        return response;
      } catch (error) {
        this.mostrar = true;
        //console.error('Error in validarExistencia:', error);
        // Handle errors here (e.g., show an error message or take appropriate action)
        return null;
      }
    } else {
      this.mostrar = true;
      return null;
    }

  }

}
