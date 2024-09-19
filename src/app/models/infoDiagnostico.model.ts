import { AlertasTratamiento } from "./alertasTratamiento.model";

export interface InfoDiagnostico {
    id: number;
    idEstado: number;
    idSeguimiento: number;
    fechaDiagnostico?: Date;
    tipoDiagnostico: number;
    fechaConsulta: Date;
    fechaInicioTratamiento?: Date;
    IPSActual: number;
    recaidas: number;
    numeroRecaidas: number;
    fechaUltimaRecaida?: Date;
    otrasRazones?: string;
    observaciones?: string;
    fechaDefuncion?: Date;
    causaMuerte?: string;
    alertasPendientes?: AlertasTratamiento[];
    alertas?: AlertasTratamiento[];
}