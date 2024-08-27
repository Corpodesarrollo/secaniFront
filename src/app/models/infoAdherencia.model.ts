export interface InfoAdherencia {
    id: number;
    haInasistidoTratamiento: boolean;
    tiempoInasistencia: number;
    idUnidadTiempo: number;
    idCausaInasistencia: number;
    causaInasistenciaOtra: string;
    estudiandoActualmente: boolean;
    haInasistidoEstudio: boolean;
    tiempoInasistenciaEstudio: number;
    idUnidadTiempoEstudio: number;
    hanInformadoDiagnosticos: boolean;
    observacion: string;
}