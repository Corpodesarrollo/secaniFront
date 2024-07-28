import { AlertaSeguimiento } from "./alertaSeguimiento.model";
import { EstadoNNA } from "./estadoNNA.model";

export interface Seguimiento {
    idCaso?: number;
    fechaNotificacion?: Date;
    nombre?: string;
    estado?: EstadoNNA;
    asuntoUltimaActuacion?: string;
    ultimaActuacion?: Date;
    alertas?: AlertaSeguimiento[];
}