import { Alerta } from "./alerta.model";
import { EstadoAlerta } from "./estadoAlerta.model";

export interface AlertaSeguimiento {
    id: number;
    alertaId: number;
    alerta: Alerta;
    seguimientoId: number;
    observaciones: string;
    estadoId: number;
    estado: EstadoAlerta;
    ultimaFechaSeguimiento: Date;
}