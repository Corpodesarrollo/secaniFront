export interface Notificacion {
    id: number;
    idEntidad: number;
    para: string[];
    conCopia: string[];
    plantillaId: number;
    asunto: string;
    mensaje: string;
    agregarComentario: boolean;
    comentario: string;
    adjunto: string;
    firma: string;
}