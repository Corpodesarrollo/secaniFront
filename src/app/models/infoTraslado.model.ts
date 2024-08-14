export interface InfoTraslado {
    id: number;
    idSeguimiento: number;
    requirioTraslado: boolean;
    //procedencia
    idDepartamentoProcedencia: number;
    idMunicipioProcedencia: number;
    barrioProcedencia: string;
    idAreaProcedencia: number;
    direccionProcedencia: string;
    idEstratoProcedencia: number;
    telefonoProcedencia: string;
    //actual
    idDepartamentoActual: number;
    idMunicipioActual: number;
    barrioActual: string;
    idAreaActual: number;
    direccionActual: string;
    idEstratoActual: number;
    telefonoActual: string;
    //informacion
    tieneCapacidadAsumirTraslado: boolean;
    EAPBApoyoTraslado: boolean;
    apoyoEntregadoOportunidad: boolean;
    apoyoConCoberturaTraslado: boolean;
    haSolicitadoApoyoFundacion: boolean;
    nombreFundacion: string;
    apoyoRecibidoFundacion: string;
    idTipoRecidenciaActual: number;
    OtroRecidenciaActual: string;
    quienAsumeCostoTraslado: string;
    quienAsumeCostoVivienda: string;
}