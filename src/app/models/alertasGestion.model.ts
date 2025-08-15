export interface AlertasGestion {
    idAlerta: number;
    idSeguimiento: number;
    alerta: string;
    idAlertaSeguimiento: number;
    textoEstado: string;
    colorEstado: string;
    fechaNotificacion: Date;
    nombreNNA: string;
    nombreEAPB: string;
    documentoNNA: string;
    categoria: string;
    subcategoria: string;
    estado: string;
}