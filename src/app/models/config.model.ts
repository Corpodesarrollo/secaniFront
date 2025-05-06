import { SubcategoriaAlerta } from "./subcategoriaAlerta.model";

export interface Config {
    smtpServer: string;
    port: number;
    enableSsl: boolean;
    userName: string;
}