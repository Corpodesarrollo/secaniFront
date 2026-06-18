export interface DatosBasicosNNA {
    idNNA: number;
    nombreCompleto: string;
    fechaNacimiento: Date;
    edad: string;
    diagnostico: string;
    fechaIngresoEstrategia: Date;
    fechaInicioSeguimiento: Date;
    ultimaActuacionFecha?: Date | string | null;
    tiempoTranscurrido: string;
    seguimientosRealizados: number;
    estado: string;
    }