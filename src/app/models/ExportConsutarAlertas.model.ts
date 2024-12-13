export interface NotificacionAlerta {
  entidadNotificada: string | undefined;
  fechaNotificacion: Date | undefined;
  asuntoNotificacion: string | undefined;
  fechaRespuesta: Date | undefined;
}

export interface Alerta {
  ultimaFechaSeguimiento: Date | undefined | null;
  categoriaAlerta: string | undefined | null;
  subcategoriaAlerta: string | undefined | null;
  observaciones: string | undefined | null;
  estadoId: string | undefined | null;
  notificacionesAlerta: NotificacionAlerta[] | undefined | null;
}

