import { Parametricas } from "../../models/parametricas.model";
import { GenericService } from "../../services/generic.services";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto lo registra como un proveedor de raíz
})
export class TablasParametricas {
    tabla: Parametricas[] = [];

     constructor(
        private repos: GenericService,
    ) { }

    public async getTP(tabla: string): Promise<Parametricas[]> {
        return new Promise((resolve, reject) => {
            this.repos.get('TablaParametrica/', `${tabla}`, 'Parametricas').subscribe({
                next: (data: any) => {
                    this.tabla = data;
                    resolve(this.tabla);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    // public async getTP(tabla: string) : Promise<Parametricas[]> {
    //     this.repos.get('TablaParametrica/', `${tabla}`, 'Parametricas').subscribe({
    //         next: (data: any) => {
    //             this.tabla = data;
    //             console.log('Datos recibidos:', this.tabla);
    //             return this.tabla;
    //         },
    //         error: (err) => console.error(err),
    //     });

    //     switch (tabla) {
    //         case 'Parentescos':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Padre'},
    //                 {id: 2, nombre: 'Madre'},
    //                 {id: 3, nombre: 'Hermano'},
    //                 {id: 4, nombre: 'Hermana'},
    //                 {id: 5, nombre: 'Abuelo'},
    //                 {id: 6, nombre: 'Abuela'},
    //                 {id: 7, nombre: 'Tio'},
    //                 {id: 8, nombre: 'Tia'},
    //                 {id: 9, nombre: 'Primo'},
    //                 {id: 10, nombre: 'Prima'},
    //                 {id: 11, nombre: 'Otro'}
    //             ];

    //         case 'TipoID':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Cédula de Ciudadanía'},
    //                 {id: 2, nombre: 'Tarjeta de Identidad'},
    //                 {id: 3, nombre: 'Cédula de Extranjería'},
    //                 {id: 4, nombre: 'Pasaporte'},
    //                 {id: 5, nombre: 'Registro Civil'},
    //                 {id: 6, nombre: 'NIT'},
    //                 {id: 7, nombre: 'Otro'}
    //             ];

    //         case 'OrigenReporte':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Cuidador'},
    //                 {id: 2, nombre: 'Familiar'},
    //                 {id: 3, nombre: 'Vecino'},
    //                 {id: 4, nombre: 'Otro'}
    //             ];

    //         case 'PaisNacimiento':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Colombia'},
    //                 {id: 2, nombre: 'Venezuela'},
    //                 {id: 3, nombre: 'Ecuador'},
    //                 {id: 4, nombre: 'Perú'},
    //                 {id: 5, nombre: 'Brasil'},
    //                 {id: 6, nombre: 'Otro'}
    //             ];

    //         case 'Etnia':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Afrodescendiente'},
    //                 {id: 2, nombre: 'Indígena'},
    //                 {id: 3, nombre: 'Raizal'},
    //                 {id: 4, nombre: 'Palenquero'},
    //                 {id: 5, nombre: 'Rrom'},
    //                 {id: 6, nombre: 'Ninguna'}
    //             ];

    //         case 'GrupoPoblacional':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Niños'},
    //                 {id: 2, nombre: 'Niñas'},
    //                 {id: 3, nombre: 'Adolescentes'},
    //                 {id: 4, nombre: 'Jóvenes'},
    //                 {id: 5, nombre: 'Adultos'},
    //                 {id: 6, nombre: 'Adultos Mayores'},
    //                 {id: 7, nombre: 'Mujeres'},
    //                 {id: 8, nombre: 'Hombres'},
    //                 {id: 9, nombre: 'LGBTI'},
    //                 {id: 10, nombre: 'Otro'}
    //             ];

    //         case 'RegimenAfiliacion':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Contributivo'},
    //                 {id: 2, nombre: 'Subsidiado'},
    //                 {id: 3, nombre: 'Especial'},
    //                 {id: 4, nombre: 'Otro'}
    //             ];

    //         case 'EAPB':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Sura'},
    //                 {id: 2, nombre: 'Sanitas'},
    //                 {id: 3, nombre: 'Coomeva'},
    //                 {id: 4, nombre: 'Compensar'},
    //                 {id: 5, nombre: 'Nueva EPS'},
    //                 {id: 6, nombre: 'Otro'}
    //             ];

    //         case 'Departamentos':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Amazonas'},
    //                 {id: 2, nombre: 'Antioquia'},
    //                 {id: 3, nombre: 'Arauca'},
    //                 {id: 4, nombre: 'Atlántico'},
    //                 {id: 5, nombre: 'Bolívar'},
    //                 {id: 6, nombre: 'Boyacá'},
    //                 {id: 7, nombre: 'Caldas'},
    //                 {id: 8, nombre: 'Caquetá'},
    //                 {id: 9, nombre: 'Casanare'},
    //                 {id: 10, nombre: 'Cauca'},
    //                 {id: 11, nombre: 'Cesar'},
    //                 {id: 12, nombre: 'Chocó'},
    //                 {id: 13, nombre: 'Córdoba'},
    //                 {id: 14, nombre: 'Cundinamarca'},
    //                 {id: 15, nombre: 'Guainía'},
    //                 {id: 16, nombre: 'Guaviare'},
    //                 {id: 17, nombre: 'Huila'},
    //                 {id: 18, nombre: 'La Guajira'},
    //                 {id: 19, nombre: 'Magdalena'},
    //                 {id: 20, nombre: 'Meta'},
    //                 {id: 21, nombre: 'Nariño'},
    //                 {id: 22, nombre: 'Norte de Santander'},
    //                 {id: 23, nombre: 'Putumayo'},
    //                 {id: 24, nombre: 'Quindío'},
    //                 {id: 25, nombre: 'Risaralda'},
    //                 {id: 26, nombre: 'San Andrés y Providencia'},
    //                 {id: 27, nombre: 'Santander'},
    //                 {id: 28, nombre: 'Sucre'},
    //                 {id: 29, nombre: 'Tolima'},
    //                 {id: 30, nombre: 'Valle del Cauca'},
    //                 {id: 31, nombre: 'Vaupés'},
    //                 {id: 32, nombre: 'Vichada'}
    //             ];

    //         case 'Municipios':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Medellín'},
    //                 {id: 2, nombre: 'Bello'},
    //                 {id: 3, nombre: 'Envigado'},
    //                 {id: 4, nombre: 'Itagüí'},
    //                 {id: 5, nombre: 'Sabaneta'},
    //                 {id: 6, nombre: 'Rionegro'},
    //                 {id: 7, nombre: 'La Ceja'},
    //                 {id: 8, nombre: 'La Estrella'},
    //                 {id: 9, nombre: 'Caldas'},
    //                 {id: 10, nombre: 'Copacabana'},
    //                 {id: 11, nombre: 'Girardota'},
    //                 {id: 12, nombre: 'Barbosa'},
    //             ];

    //         case 'Barrios':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Barrio 1'},
    //                 {id: 2, nombre: 'Barrio 2'},
    //                 {id: 3, nombre: 'Barrio 3'},
    //                 {id: 4, nombre: 'Barrio 4'},
    //                 {id: 5, nombre: 'Barrio 5'},
    //                 {id: 6, nombre: 'Barrio 6'},
    //                 {id: 7, nombre: 'Barrio 7'},
    //                 {id: 8, nombre: 'Barrio 8'},
    //                 {id: 9, nombre: 'Barrio 9'},
    //                 {id: 10, nombre: 'Barrio 10'},
    //                 {id: 11, nombre: 'Barrio 11'},
    //                 {id: 12, nombre: 'Barrio 12'},
    //             ];

    //         case 'Areas':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Area 1'},
    //                 {id: 2, nombre: 'Area 2'},
    //                 {id: 3, nombre: 'Area 3'},
    //                 {id: 4, nombre: 'Area 4'},
    //                 {id: 5, nombre: 'Area 5'},
    //                 {id: 6, nombre: 'Area 6'},
    //                 {id: 7, nombre: 'Area 7'},
    //                 {id: 8, nombre: 'Area 8'},
    //                 {id: 9, nombre: 'Area 9'},
    //                 {id: 10, nombre: 'Area 10'},
    //                 {id: 11, nombre: 'Area 11'},
    //                 {id: 12, nombre: 'Area 12'},
    //             ];

    //         case 'TipoRecidencia':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Casa'},
    //                 {id: 2, nombre: 'Apartamento'},
    //                 {id: 3, nombre: 'Finca'},
    //                 {id: 4, nombre: 'Otro'}
    //             ];

    //         case 'TiposRecursos':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Derecho de Petición'},
    //                 {id: 2, nombre: 'Tutela'},
    //                 {id: 3, nombre: 'Acción de Grupo'},
    //                 {id: 4, nombre: 'Acción Popular'},
    //                 {id: 5, nombre: 'Acción de Cumplimiento'},
    //                 {id: 6, nombre: 'Otro'}
    //             ];

    //         case 'IPS':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'IPS 1'},
    //                 {id: 2, nombre: 'IPS 2'},
    //                 {id: 3, nombre: 'IPS 3'},
    //                 {id: 4, nombre: 'IPS 4'},
    //                 {id: 5, nombre: 'IPS 5'},
    //                 {id: 6, nombre: 'IPS 6'},
    //                 {id: 7, nombre: 'IPS 7'},
    //                 {id: 8, nombre: 'IPS 8'},
    //                 {id: 9, nombre: 'IPS 9'},
    //                 {id: 10, nombre: 'IPS 10'},
    //                 {id: 11, nombre: 'IPS 11'},
    //                 {id: 12, nombre: 'IPS 12'},
    //             ];

    //         case 'CategoriaAlerta':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Categoria 1'},
    //                 {id: 2, nombre: 'Categoria 2'},
    //                 {id: 3, nombre: 'Categoria 3'},
    //                 {id: 4, nombre: 'Categoria 4'},
    //                 {id: 5, nombre: 'Categoria 5'},
    //                 {id: 6, nombre: 'Categoria 6'},
    //                 {id: 7, nombre: 'Categoria 7'},
    //                 {id: 8, nombre: 'Categoria 8'},
    //                 {id: 9, nombre: 'Categoria 9'},
    //                 {id: 10, nombre: 'Categoria 10'},
    //                 {id: 11, nombre: 'Categoria 11'},
    //                 {id: 12, nombre: 'Categoria 12'},
    //             ];

    //         case 'SubcategoriaAlerta':
    //             return this.tabla = [
    //                 {id: 1, nombre: 'Subcategoria 1'},
    //                 {id: 2, nombre: 'Subcategoria 2'},
    //                 {id: 3, nombre: 'Subcategoria 3'},
    //                 {id: 4, nombre: 'Subcategoria 4'},
    //                 {id: 5, nombre: 'Subcategoria 5'},
    //                 {id: 6, nombre: 'Subcategoria 6'},
    //                 {id: 7, nombre: 'Subcategoria 7'},
    //                 {id: 8, nombre: 'Subcategoria 8'},
    //                 {id: 9, nombre: 'Subcategoria 9'},
    //                 {id: 10, nombre: 'Subcategoria 10'},
    //                 {id: 11, nombre: 'Subcategoria 11'},
    //                 {id: 12, nombre: 'Subcategoria 12'},
    //             ];

    //         default:
    //             return this.tabla = [];
    //     }
    // }
}