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
}