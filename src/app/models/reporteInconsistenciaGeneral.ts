export interface ReporteInconsistenciaGeneral {
    totalInconsistencias: number;
    inconsistenciasPorCampo: { [campo: string]: number };
    inconsistenciasPorFuente: InconsistenciaFuente[];
    inconsistenciasPorDepartamento: InconsistenciaDepartamento[];
    inconsistenciasPorMunicipio: InconsistenciaMunicipio[];
    inconsistenciasPorTipoCancer: InconsistenciaTipoCancer[];
    inconsistenciasPorDiagnostico: InconsistenciaDiagnostico[];
    tiempoPromedioResolucionDias: number;
    totalResueltos: number;
    totalPendientes: number;
    validadasAutomaticamente: number;
    validadasManualmente: number;
    tasaReincidencia: number;
    totalReincidentes: number;
    impactoNotificacionDias: number;
    impactoTratamientoDias: number;
    camposCriticosTrazabilidad: CampoCriticoTrazabilidad[];
}

export interface InconsistenciaDepartamento {
    departamentoId: string;
    departamento: string;
    totalInconsistencias: number;
    porcentaje: number;
}

export interface InconsistenciaMunicipio {
    municipioId: string;
    municipio: string;
    departamento: string;
    totalInconsistencias: number;
    porcentaje: number;
}

export interface InconsistenciaDiagnostico {
    diagnosticoId: number | null;
    diagnostico: string;
    totalInconsistencias: number;
    porcentaje: number;
}

export interface InconsistenciaTipoCancer {
    tipoCancerId: string;
    tipoCancer: string;
    totalInconsistencias: number;
    porcentaje: number;
}

export interface InconsistenciaFuente {
    fuente: string;
    totalInconsistencias: number;
    porcentaje: number;
}

export interface CampoCriticoTrazabilidad {
    campo: string;
    totalNNAs: number;
    nnAsConFalta: number;
    porcentajeInconsistencia: number;
}
