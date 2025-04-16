import { EstadoAlerta } from "./estadoAlerta.model";
import { EstadoNNA } from "./estadoNNA.model";

export interface Seguimiento {
    id?: number;
    noCaso: number;
    fechaSeguimiento: Date|null;
    fechaNotificacion: Date|null;
    nombreCompleto: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    fechaNacimiento: Date;
    sexo: string;
    parentesco: string;
    diagnostico: string;
    aseguradora: string;
    observaciones: string;
    entidadAlerta: string;
    estadoSeguimiento: string;
    estado: EstadoNNA;
    asuntoUltimaActuacion: string;
    fechaSolicitud: Date|null;
    fechaAsignacion: Date|null;
    fechaUltimaActuacion: Date|null;
    alertas: EstadoAlerta[];
    nombreAgenteActual: string;
}

