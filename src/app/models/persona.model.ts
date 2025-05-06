
export interface Persona {
    idEvol: number;
    serial_ms_evol: number;
    tipo_identificacion: string;
    numero_identificacion: string;
    primer_apellido: string;
    segundo_apellido: string;
    primer_nombre: string;
    segundo_nombre: string;
    fecha_nacimiento: string;
    sexo: string;
    fecha_expedicion: string;
    vigente: boolean;
    esFallecido: boolean;
    fechaFallecimiento: string | null;
}