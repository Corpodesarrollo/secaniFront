import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogNnaMsgSeguimientoComponent } from "../../../../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component";

@Component({
  selector: 'app-dialog-crear-nna-msg-rol-coordinador',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, FormsModule, DialogNnaMsgSeguimientoComponent], 
  templateUrl: './dialog-crear-nna-msg-rol-coordinador.component.html',
  styleUrls: ['../../../general.component.css', './dialog-crear-nna-msg-rol-coordinador.component.css']
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
