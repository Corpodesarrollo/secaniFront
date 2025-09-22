export interface Notificaciones{
    idNotificacion: number;
    tipoNotificacion: number;
    idSeguimiento: number;
    agenteDestino: string;
    idAgenteDestino: string;
    rolAgenteDestino: string;
    idAgenteOrigen: string;
    agenteOrigen: string;
    rolAgenteOrigen: string;
    textoNotificacion: string;
    fechaNotificacion: string;
    uRLNotificacion : string;
}