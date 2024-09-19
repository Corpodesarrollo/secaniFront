import { EstadoAlerta } from "./estadoAlerta.model";

export interface SeguimientoHistorial {
    idSeguimiento: number;
    fechaSeguimiento: Date;
    alertasSeguimientos: EstadoAlerta[];
    observacion: string;
    nombreEntidad: string;
    fechaNotificacion: Date;
    fechaRespuesta: Date;
    asunto: string;
}