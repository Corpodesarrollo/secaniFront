export class UploadFileRequest {
  fileName?: string;
  fileBytes?: string;
}

export class ReportesSIVIGILA {
  id: number = 0;
  tipoIdentificacionId!: string;
  numeroIdentificacion!: string;
  primerNombre!: string;
  segundoNombre?: string;
  primerApellido!: string;
  segundoApellido?: string;
  fechaNacimiento!: Date | null;
  sexoId!: string;
  tieneDiagnostico: boolean = false;
  aseguradora!: number;
  departamentoProcedenciaId?: string;
  municipioProcedenciaId?: string;
  evidenciaDiagnostico?: UploadFileRequest;
  evidenciaParentesco?: UploadFileRequest;
}

