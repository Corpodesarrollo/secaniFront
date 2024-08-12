import { SubcategoriaAlerta } from "./subcategoriaAlerta.model";

export interface Alerta {
    id?: number;
    subcategoriaId: number;
    subcategoria: SubcategoriaAlerta;
    descripcion: string;
    alias: string;
}