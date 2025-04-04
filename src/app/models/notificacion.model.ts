import { Attachment } from "./attachmentFile.model";

export interface Notificacion {
    id: number;
    idEntidad: string;
    para: string[];
    conCopia: string[];
    plantillaId: number;
    asunto: string;
    mensaje: string;
    agregarComentario: boolean;
    comentario: string;
    adjunto: Attachment | null;
    firma: string;
}