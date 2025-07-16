export interface ReporteDepuracion {
    id:                  number;
    fecha:               Date;
    hora:                string;
    registrosIngresados: number;
    registrosNuevos:     number;
    registrosDuplicados: number;
    segundasNeoplasias:  number;
    recaidas:            number;
    estado:              string;
}
