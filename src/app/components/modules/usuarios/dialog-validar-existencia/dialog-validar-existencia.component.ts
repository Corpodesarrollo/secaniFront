import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GenericService } from '../../../../services/generic.services';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Generico } from '../../../../core/services/generico';

@Component({
  selector: 'app-dialog-validar-existencia',
  templateUrl: './dialog-validar-existencia.component.html',
  styleUrls: ['../general.component.css', './dialog-validar-existencia.component.css'],
  encapsulation: ViewEncapsulation.None // Por defecto
})
export class DialogValidarExistenciaComponent {

  @Input() tipoId: any; // Recibir datos del padre
  @Input() numeroId: any; // Recibir datos del padre
  @Output() dataToParentValidarExistencia = new EventEmitter<any>(); // Emitir datos al padre

  constructor(private service: GenericService, private router: Router, private axios: Generico) { }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  btn_ver_detalle_nna() {
    this.router.navigate(["/usuarios/ver_detalle_nna"]);
  }

  async validarExistencia() {
    const baseUrl = environment.url_MsNna;
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
  
      return response;
    } catch (error) {
      //console.error('Error in validarExistencia:', error);
      // Handle errors here (e.g., show an error message or take appropriate action)
      return null;
    }
  }

}
