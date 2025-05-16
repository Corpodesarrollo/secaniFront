import { Attachment } from "./attachmentFile.model";

export interface notificacionOficio {
    idEntidad: number;
    para: string[];
    conCopia: string[];
    plantillaId: string;
    asunto: string;
    mensaje: string;
    enlace: string;
    adjunto: Attachment | null;
    comentario: string;
    firma: string;
    idNotificacionEntidad: number;
}