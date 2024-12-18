export interface RespuestasAlerta {
    id: number;
    de: string;
    notificacionEntidadId: number;
    nombre: string;
    cargo: string;
    correo: string;
    telefono: string;
    respuesta: string;
    entidadId: number;
    asunto: string;
    conCopia: string;
    firma: string;
    mensaje: string;
    para: string;
    AlertaId: number;
    dateCreated: Date;
}