export class NNA {
    id!: number;
    estadoId!: number;
    residenciaActualCategoriaId!: string;
    residenciaActualMunicipioId!: string;
    residenciaActualBarrio!: string;
    residenciaActualAreaId!: string;
    residenciaActualDireccion!: string;
    residenciaActualEstratoId!: string;
    residenciaActualTelefono!: string;
    residenciaOrigenCategoriaId!: string;
    residenciaOrigenMunicipioId!: string;
    residenciaOrigenBarrio!: string;
    residenciaOrigenAreaId!: string;
    residenciaOrigenDireccion!: string;
    residenciaOrigenEstratoId!: string;
    residenciaOrigenTelefono!: string;
    fechaNotificacionSIVIGILA!: Date;
    primerNombre!: string;
    segundoNombre!: string;
    primerApellido!: string;
    segundoApellido!: string;
    tipoIdentificacionId!: string;
    numeroIdentificacion!: string;
    fechaNacimiento!: Date;
    edad!: string;
    municipioNacimientoId!: string;
    sexoId!: string;
    tipoRegimenSSId!: string;
    eapbId!: string;
    epsId!: number;
    ipsId!: number;
    grupoPoblacionId!: string;
    etniaId!: string;
    estadoIngresoEstrategiaId!: number;
    fechaIngresoEstrategia!: Date;
    origenReporteId!: number;
    fechaConsultaOrigenReporte!: Date;
    tipoCancerId!: string;
    fechaInicioSintomas!: Date;
    fechaHospitalizacion!: Date;
    fechaDefuncion!: Date;
    motivoDefuncion!: string;
    fechaInicioTratamiento!: Date;
    recaida!: boolean;
    cantidadRecaidas!: number;
    fechaUltimaRecaida!: Date;
    tipoDiagnosticoId!: string;
    diagnosticoId!: number;
    fechaDiagnostico!: Date;
    motivoNoDiagnosticoId!: string;
    motivoNoDiagnosticoOtro!: string;
    fechaConsultaDiagnostico!: Date;
    departamentoTratamientoId!: string;
    ipsIdTratamiento!: boolean;
    propietarioResidenciaActual!: boolean;
    propietarioResidenciaActualOtro!: string;
    trasladoTieneCapacidadEconomica!: boolean;
    trasladoEAPBSuministroApoyo!: boolean;
    trasladosServiciosdeApoyoOportunos!: boolean;
    trasladosServiciosdeApoyoCobertura!: boolean;
    trasladosHaSolicitadoApoyoFundacion!: string;
    trasladosNombreFundacion!: string;
    trasladosApoyoRecibidoxFundacion!: string;
    difAutorizaciondeMedicamentos!: boolean;
    difEntregaMedicamentosLAP!: boolean;
    difEntregaMedicamentosNoLAP!: boolean;
    difAsignaciondeCitas!: boolean;
    difHanCobradoCuotasoCopagos!: boolean;
    difAutorizacionProcedimientos!: boolean;
    difRemisionInstitucionesEspecializadas!: boolean;
    difMalaAtencionIPS!: boolean;
    difMalaAtencionNombreIPSId!: number;
    difFallasenMIPRES!: boolean;
    difFallaConvenioEAPBeIPSTratante!: boolean;
    categoriaAlertaId!: number;
    subcategoriaAlertaId!: number;
    trasladosHaSidoTrasladadodeInstitucion!: boolean;
    trasladosNumerodeTraslados!: number;
    trasladosIPSId!: number;
    trasladosHaRecurridoAccionLegal!: boolean;
    trasladosTipoAccionLegalId!: string;
    tratamientoRequirioCambiodeCiudad!: boolean;
    tratamientoHaDejadodeAsistir!: boolean;
    tratamientoCuantoTiemposinAsistir!: number;
    tratamientoUnidadMedidaIdTiempoId!: string;
    tratamientoCausasInasistenciaId!: string;
    tratamientoCausasInasistenciaOtra!: string;
    tratamientoEstudiaActualmente!: boolean;
    tratamientoHaDejadodeAsistirColegio!: boolean;
    tratamientoTiempoInasistenciaColegio!: number;
    tratamientoTiempoInasistenciaUnidadMedidaId!: string;
    tratamientoHaSidoInformadoClaramente!: boolean;
    tratamientoObservaciones!: string;
    cuidadorNombres: string | undefined;
    cuidadorParentescoId!: string;
    cuidadorEmail!: string;
    cuidadorTelefono!: string;
    cuidadorTelefono2!: string;
    seguimientoLoDesea!: string;
    seguimientoMotivoNoLoDesea!: string;
    dateDeleted!: Date;
    dateUpdated!: Date;
    createdByUserId!: string;
    dateCreated!: Date;
    deletedByUserId!: string;
    isDeleted!: boolean;
    updatedByUserId!: string;
    origenReporteOtro!: string;
    paisId!: string;
    trasladosMotivoAccionLegal!: string;
    trasladosPropietarioResidenciaActualId!: string;
    trasladosPropietarioResidenciaActualOtro!: string;
    trasladosQuienAsumioCostosTraslado!: string;
    trasladosQuienAsumioCostosVivienda!: string;
}