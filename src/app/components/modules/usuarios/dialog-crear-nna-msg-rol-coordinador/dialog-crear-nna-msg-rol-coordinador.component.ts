import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-crear-nna-msg-rol-coordinador',
  templateUrl: './dialog-crear-nna-msg-rol-coordinador.component.html',
  styleUrls: ['../general.component.css', './dialog-crear-nna-msg-rol-coordinador.component.css']
})
export class DialogCrearNnaMsgRolCoordinadorComponent {
  @Input() visible: boolean = false; // Recibir datos del padre
  @Input() nnaId: any; // Recibir datos del padre 
  @Input() agenteId: any;
  @Input() coordinadorId: any;

  rolId = sessionStorage.getItem('roleId');
  visibleDialogSeguimiento: boolean = false;
  

  onSeguimiento(){
    this.visibleDialogSeguimiento=true;
    this.visible=false;
  }
}
