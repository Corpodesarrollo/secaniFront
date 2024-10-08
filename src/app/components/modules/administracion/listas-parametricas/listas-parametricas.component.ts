import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ListasParametricasService } from '../../../../services/listas-parametricas.service';


@Component({
  selector: 'app-listas-parametricas',
  standalone: true,
  imports: [ButtonModule, RouterModule, TableModule],
  templateUrl: './listas-parametricas.component.html',
  styleUrl: './listas-parametricas.component.css'
})
export class ListasParametricasComponent implements OnInit {
  public listasParametricas: any[] = [];

  constructor(private listasParametricasService: ListasParametricasService) { }

  async ngOnInit(): Promise<void> {
    this.listasParametricas = await this.listasParametricasService.getListasParametricas();
  }
}
