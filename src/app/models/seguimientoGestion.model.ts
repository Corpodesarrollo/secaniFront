
import { EstadoAlerta } from '../models/estadoAlerta.model';
export interface SeguimientoGestion {
    id?: number;
    nnaId: number;
    fechaSeguimiento: Date;
    estadoId: number;
    contactoNNAId: number;
    telefono: string;
    usuarioId: string;
    solicitanteId: number;
    fechaSolicitud: Date;
    tieneDiagnosticos: boolean;
    observacionesSolicitante: string; 
    observacionAgente: string;
    ultimaActuacionAsunto: string;
    ultimaActuacionFecha: Date;
    nombreRechazo: string;
    parentescoRechazo: string;
    razonesRechazo: string;
    alertas: number[];
    alertasPendientes: EstadoAlerta[];
}