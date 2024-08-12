import { EstadoAlerta } from "./estadoAlerta.model";
import { EstadoNNA } from "./estadoNNA.model";

export interface Seguimiento {
    id?: number;
    noCaso: number;
    fechaNotificacion: Date;
    nombreCompleto: string;
    estado: EstadoNNA;
    asuntoUltimaActuacion: string;
    fechaUltimaActuacion: Date;
    alertas: EstadoAlerta[];
}