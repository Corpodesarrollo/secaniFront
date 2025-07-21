export interface ReporteGeneralLlamadas {
    id:               number;
    agenteId:         string;
    agente:           string;
    fechaIntento:     Date;
    llamadasExitosas: number;
    llamadasFallidas: number;
    observaciones:    null;
    detallesFallas:   { [key: string]: number };
}