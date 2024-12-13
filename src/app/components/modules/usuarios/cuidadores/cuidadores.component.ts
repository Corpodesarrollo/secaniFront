import { Component } from '@angular/core';
import { GenericService } from '../../../../services/generic.services';
import { apis } from '../../../../models/apis.model';
import { TableModule } from 'primeng/table';
import { Cuidador } from '../../../../models/cuidador.model';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cuidadores',
  standalone: true,
  imports: [TableModule,CardModule],
  templateUrl: './cuidadores.component.html',
  styleUrl: './cuidadores.component.css'
})
export class CuidadoresComponent {
  cuidadores: Cuidador[] = [];

  constructor(
    private repos: GenericService
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  CargarDatos() {
    this.repos.get('Cuidador', ``, apis.nna).subscribe({
      next: (data: any) => {
        this.cuidadores = data;
      }
    });
  }
}
