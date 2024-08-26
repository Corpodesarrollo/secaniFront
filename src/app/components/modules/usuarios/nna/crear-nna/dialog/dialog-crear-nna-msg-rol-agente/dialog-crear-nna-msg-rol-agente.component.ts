import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TpParametros } from '../../../../../../../core/services/tpParametros';
import { Generico } from '../../../../../../../core/services/generico';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogNnaMsgSeguimientoComponent } from "../../../../../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component";

@Component({
  selector: 'app-dialog-crear-nna-msg-rol-agente',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, FormsModule, DialogNnaMsgSeguimientoComponent],
  templateUrl: './dialog-crear-nna-msg-rol-agente.component.html',
  styleUrls: ['../../../../general.component.css','./dialog-crear-nna-msg-rol-agente.component.css']
})
export class DialogCrearNnaMsgRolAgenteComponent {
  @Input() visible: boolean = false; // Recibir datos del padre
  @Input() nnaId: any; // Recibir datos del padre
  @Input() agenteId: any;
  @Input() coordinadorId: any;
  @Input() contactoNNAId:any;

  rolId = sessionStorage.getItem('roleId');
  visibleDialogSeguimiento: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {}

  onSeguimiento(){
    this.visibleDialogSeguimiento=true;
    this.visible=false;
  }

  onIniciarSeguimiento(){
    this.visible=false;
    this.router.navigate(["/gestion/iniciar_seguimiento"]);
  }
}
