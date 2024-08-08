import { parametricas } from "../../models/parametricas.model";
import { GenericService } from "../../services/generic.services";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto lo registra como un proveedor de raíz
})
export class TablasParametricas {
    tabla: parametricas[] = [];

     constructor(
        private repos: GenericService,
    ) { }

    public getTP(tabla: string) : parametricas[] {
        // this.repos.get('api/TablaParametrica/', `${tabla}`, 'Entidad').subscribe({
        //     next: (data: any) => {
        //         this.tabla = data;
        //     }
        // });

        switch (tabla) {
            case 'Parentescos':
                return this.tabla = [
                    {id: 1, nombre: 'Padre'},
                    {id: 2, nombre: 'Madre'},
                    {id: 3, nombre: 'Hermano'},
                    {id: 4, nombre: 'Hermana'},
                    {id: 5, nombre: 'Abuelo'},
                    {id: 6, nombre: 'Abuela'},
                    {id: 7, nombre: 'Tio'},
                    {id: 8, nombre: 'Tia'},
                    {id: 9, nombre: 'Primo'},
                    {id: 10, nombre: 'Prima'},
                    {id: 11, nombre: 'Otro'}
                ];

            case 'TipoID':
                return this.tabla = [
                    {id: 1, nombre: 'Cédula de Ciudadanía'},
                    {id: 2, nombre: 'Tarjeta de Identidad'},
                    {id: 3, nombre: 'Cédula de Extranjería'},
                    {id: 4, nombre: 'Pasaporte'},
                    {id: 5, nombre: 'Registro Civil'},
                    {id: 6, nombre: 'NIT'},
                    {id: 7, nombre: 'Otro'}
                ];

            case 'OrigenReporte':
                return this.tabla = [
                    {id: 1, nombre: 'Cuidador'},
                    {id: 2, nombre: 'Familiar'},
                    {id: 3, nombre: 'Vecino'},
                    {id: 4, nombre: 'Otro'}
                ];

            case 'PaisNacimiento':
                return this.tabla = [
                    {id: 1, nombre: 'Colombia'},
                    {id: 2, nombre: 'Venezuela'},
                    {id: 3, nombre: 'Ecuador'},
                    {id: 4, nombre: 'Perú'},
                    {id: 5, nombre: 'Brasil'},
                    {id: 6, nombre: 'Otro'}
                ];

            case 'Etnia':
                return this.tabla = [
                    {id: 1, nombre: 'Afrodescendiente'},
                    {id: 2, nombre: 'Indígena'},
                    {id: 3, nombre: 'Raizal'},
                    {id: 4, nombre: 'Palenquero'},
                    {id: 5, nombre: 'Rrom'},
                    {id: 6, nombre: 'Ninguna'}
                ];

            case 'GrupoPoblacional':
                return this.tabla = [
                    {id: 1, nombre: 'Niños'},
                    {id: 2, nombre: 'Niñas'},
                    {id: 3, nombre: 'Adolescentes'},
                    {id: 4, nombre: 'Jóvenes'},
                    {id: 5, nombre: 'Adultos'},
                    {id: 6, nombre: 'Adultos Mayores'},
                    {id: 7, nombre: 'Mujeres'},
                    {id: 8, nombre: 'Hombres'},
                    {id: 9, nombre: 'LGBTI'},
                    {id: 10, nombre: 'Otro'}
                ];

            case 'RegimenAfiliacion':
                return this.tabla = [
                    {id: 1, nombre: 'Contributivo'},
                    {id: 2, nombre: 'Subsidiado'},
                    {id: 3, nombre: 'Especial'},
                    {id: 4, nombre: 'Otro'}
                ];

            case 'EAPB':
                return this.tabla = [
                    {id: 1, nombre: 'Sura'},
                    {id: 2, nombre: 'Sanitas'},
                    {id: 3, nombre: 'Coomeva'},
                    {id: 4, nombre: 'Compensar'},
                    {id: 5, nombre: 'Nueva EPS'},
                    {id: 6, nombre: 'Otro'}
                ];

            default:
                return this.tabla = [];
        }
    }
}