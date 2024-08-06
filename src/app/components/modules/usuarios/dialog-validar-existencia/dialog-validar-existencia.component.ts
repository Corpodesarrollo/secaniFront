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
  @Output() dataToParent = new EventEmitter<any>(); // Emitir datos al padre

  constructor(private service: GenericService, private router: Router, private axios: Generico) { }

  visible: boolean = false;

  async showDialog() {
    if (await this.validarExistencia() != null) {
      this.visible = true;
    }
  }

  btn_ver_detalle_nna() {
    this.router.navigate(["/usuarios/ver_detalle_nna"]);
  }

  async validarExistencia() {
    var baseUrl = environment.url_MsNna;
    var url = "NNA/ConsultarNNAsByTipoIdNumeroId/" + this.tipoId + "/" + this.numeroId;
    var response:any = await this.axios.retorno_get(url, baseUrl);
    this.dataToParent.emit(response); // Ensure this is an EventEmitter
    console.log("validarExistencia :: ", response, url, this.dataToParent);
    return response;
  }

}
