export interface Usuario {
    id: string | null;
    fullName: string | null;
    email: string | null;
    telefonos: string | null;
    estado: string | null;
    entidadId: string | null;
    roles: string[] | null;
  }