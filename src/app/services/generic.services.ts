import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericService {

  constructor(private http: HttpClient) { }

  private getApiUrl(api: string): string {
    switch (api) {
      case 'Seguridad':
        return environment.urlMSSeguridad;
      case 'Portal':
        return environment.urlMSPortal;
      case 'Administrador':
        return environment.urlMSAdministracion;
      default:
        return environment.urlBase;
    }
  }

  public get(modulo: string, parameters: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.get(`${apiUrl}${modulo}${parameters}`);
    }
  }

  public getWithOutParameters(modulo: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.get(`${apiUrl}${modulo}`, { withCredentials: true });
    } else {
      return this.http.get<any[]>(`${apiUrl}${modulo}`);
    }
  }

  public post(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.post(`${apiUrl}${modulo}`, parameters, { withCredentials: true });
    } else {
      return this.http.post(`${apiUrl}${modulo}`, parameters);
    }
  }

  public put(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.put(`${apiUrl}${modulo}`, parameters, { withCredentials: true });
    } else {
      return this.http.put(`${apiUrl}${modulo}`, parameters);
    }
  }

  public delete(modulo: string, parameters: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.delete(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.put(`${apiUrl}${modulo}`, parameters);
    }
  } 
}
