export interface InfoTraslado {
    id: number;
    idSeguimiento: number;
    requirioTraslado: boolean;
    //procedencia
    idDepartamentoProcedencia: number;
    idMunicipioProcedencia: number;
    idBarrioProcedencia: number;
    idAreaProcedencia: number;
    direccionProcedencia: string;
    estratoProcedencia: number;
    telefonoProcedencia: string;
    //actual
    idDepartamentoActual: number;
    idMunicipioActual: number;
    idBarrioActual: number;
    idAreaActual: number;
    direccionActual: string;
    estratoActual: number;
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