import { AlertaSeguimientoDetalle } from "./alertaSeguimientoDetalle.model";

export interface SeguimientoDetalle {
    idSeguimiento: number;
    fechaSeguimiento: string;
    alertasSeguimientos: AlertaSeguimientoDetalle[];
    observacion: string;
    nombreEntidad: string | null;
    fechaNotificacion: string;
    fechaRespuesta: string;
    asunto: string;
    fechaInicioSeguimiento: string;
}