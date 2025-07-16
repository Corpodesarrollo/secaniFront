export interface Columna<T = any> {
  header: string;
  field: keyof T;
}