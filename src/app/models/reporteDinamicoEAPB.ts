export interface ReporteDinamicoEAPB {
    eapbId: number;
    eapb: string;
    casosAsociados: number;
    casosConAlertasSinResolver: number;
    totalDeAlertasSinResolver: number;
    promedioTiempoRespuestaAlertas: number;
    casosRegimenContributivo: number;
    casosRegimenSubsidiado: number;
    casosRegimenEspecial: number;
    casosRegimenExcepcion: number;
    casosRegimenNoAfiliado: number;
    totalAlertasResueltas: number;
    casosSeguimientoPorIniciar: number;
    casosSeguimientoEnProceso: number;
    casosSeguimientoCulminado: number;
}
