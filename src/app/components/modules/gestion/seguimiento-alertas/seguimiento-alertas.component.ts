import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Parametricas } from '../../../../models/parametricas.model';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TpParametros } from '../../../../core/services/tpParametros';
import { AlertasTratamiento } from '../../../../models/alertasTratamiento.model';
import { FormsModule } from '@angular/forms';
import { SubcategoriaAlerta } from '../../../../models/subcategoriaAlerta.model';

@Component({
  selector: 'app-seguimiento-alertas',
  standalone: true,
  imports: [CommonModule, DropdownModule, InputTextModule, TableModule, FormsModule],
  templateUrl: './seguimiento-alertas.component.html',
  styleUrl: './seguimiento-alertas.component.css'
})
export class SeguimientoAlertasComponent implements OnInit {
  constructor(private tpp: TpParametros) {}

  @Output() alertasChange = new EventEmitter<AlertasTratamiento[]>();
  
  selectedCategoriaAlerta: Parametricas | undefined;
  selectedSubcategoriaAlerta: SubcategoriaAlerta | undefined;

  isLoadingCategoriaAlerta: boolean = true;
  isLoadingSubcategoriaAlerta: boolean = false;

  categoriaAlerta: Parametricas[] = [];
  subcategoriaAlerta: SubcategoriaAlerta[] = [];
  alertas: AlertasTratamiento[] = [];

  async ngOnInit(): Promise<void> {
    this.categoriaAlerta =  await this.tpp.getCategoriaAlerta();
    this.isLoadingCategoriaAlerta = false;
  }

  BorrarAlerta(index: number) {
    this.alertas.splice(index, 1);
    this.alertasChange.emit(this.alertas);
  }

  AgregarAlerta() {
    if (!this.selectedCategoriaAlerta || !this.selectedSubcategoriaAlerta) {
      return;
    }

    let existe = false;
    this.alertas.forEach((alerta) => {
      if (alerta.idCategoriaAlerta == this.selectedCategoriaAlerta?.id &&
        alerta.idSubcategoriaAlerta == this.selectedSubcategoriaAlerta?.id) {
        existe = true;
      }
    });

    if (existe) {
      return;
    }

    let alerta: AlertasTratamiento = {
      idCategoriaAlerta: this.selectedCategoriaAlerta?.id || 0,
      categoriaAlerta: this.selectedCategoriaAlerta?.nombre || '',
      idSubcategoriaAlerta: this.selectedSubcategoriaAlerta?.id || 0,
      subcategoriaAlerta: this.selectedSubcategoriaAlerta?.subCategoriaAlerta || '',
      resuelta: false
    };

    this.alertas.push(alerta);

    this.selectedCategoriaAlerta = undefined;
    this.selectedSubcategoriaAlerta = undefined;

    this.alertasChange.emit(this.alertas);
  }

  CargarSubcategorias() {
    this.isLoadingSubcategoriaAlerta = true;
    this.subcategoriaAlerta = [];
    this.tpp.getSubCategoriaAlerta(this.selectedCategoriaAlerta?.id || 0).then((data) => {
      this.subcategoriaAlerta = data.subCategorias;
      this.subcategoriaAlerta.forEach((subcategoria) => {
        subcategoria.nombre = `${subcategoria.indicador}. ${subcategoria.subCategoriaAlerta}`;
      });
    });
    this.isLoadingSubcategoriaAlerta = false;
  }
}
