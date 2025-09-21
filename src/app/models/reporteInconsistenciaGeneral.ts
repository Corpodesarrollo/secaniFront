export interface ReporteInconsistenciaGeneral {
    totalInconsistencias:           number;
    inconsistenciasPorCampo:        InconsistenciasPorCampo[];
    inconsistenciasPorDepartamento: any[];
    inconsistenciasPorDiagnostico:  any[];
}

export interface InconsistenciasPorCampo {
    TipoIdentificacion: number;
    Nombres:            number;
    SexoId:             number;
    FechaDefuncion:     number;
}
