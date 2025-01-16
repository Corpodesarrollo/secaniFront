export interface AlertasGestion {
    idAlerta: number;
    alerta: string;
    idAlertaSeguimiento: number;
    textoEstado: string;
    colorEstado: string;
    fechaNotificacion: Date;
    nombreNNA: string;
    documentoNNA: string;
    categoria: string;
    subcategoria: string;
    estado: string;
}