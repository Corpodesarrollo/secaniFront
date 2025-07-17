export interface ReporteDinamicoEAPB {
    eapb:                                string;
    casosAsociados:                      string;
    casosAlertasSinResolver:             string;
    totalAlertasSinResolver:             string;
    promedioTiempoRespuestaAlertas:      string;
    casosRegimenAfiliacionContributivo:  string;
    casosRegimenAfiliacionSubsidiado:    string;
    casosRegimenAfiliacionEspecial:      string;
    casosRegimenAfiliacionNoAsegurados:  string;
    totalAlertasResueltas:               string;
    casosSeguimientoPorIniciar:          string;
    casosSeguimientoEnProceso:           string;
    casosSeguimientoCulminado:           string;
}