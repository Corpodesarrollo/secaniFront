import { AlertasTratamiento } from "./alertasTratamiento.model";

export interface InfoDificultad {
    autorizacionMedicamentos: boolean;
    entregaMedicamentosLAP: boolean;
    entregaMedicamentosNoLAP: boolean;
    asignacionCitas: boolean;
    leHanCobradoCopagosCuotas: boolean;
    autoriacionProcedimientos: boolean;
    remisionInstitucionesEspecializadas: boolean;
    malaAtencionIPS: boolean;
    malaAtencionIPSCual: string;
    fallasMIPRES: boolean;
    fallaConventioEAPBeIPS: boolean;
    alertasTratamiento: AlertasTratamiento | undefined;
    haSidoTrasladado: boolean;
    numeroTraslados: number;
    idIPS: number[];
    haRecurridoAccionLegalAtencion: boolean;
    motivo: string;
    idTipoRecurso: number;
}