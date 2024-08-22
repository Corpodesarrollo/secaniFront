import { SubcategoriaAlerta } from "./subcategoriaAlerta.model";

export interface Categoria{
    id?:number;
    nombre?:string;
    descripcion?:string;
    subCategorias?:SubcategoriaAlerta[];
}