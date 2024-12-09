import { EstadoAlerta } from "./estadoAlerta.model";
import { EstadoNNA } from "./estadoNNA.model";

export interface Seguimiento {
    id?: number;
    noCaso: number;
    fechaSeguimiento: Date;
    fechaNotificacion: Date;
    nombreCompleto: string;
    observaciones: string;
    entidadAlerta: string;
    estado: EstadoNNA;
    asuntoUltimaActuacion: string;
    fechaUltimaActuacion: Date;
    alertas: EstadoAlerta[];
}

