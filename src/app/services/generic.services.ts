import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';

import { CabecerasGenericas } from './cabecerasGenericas';
import { environment } from '../../environments/environment';

import axios, { AxiosResponse } from 'axios';


@Injectable({
  providedIn: 'root',
})
export class GenericService {

  private url = environment.url_MsAuthention;

  private notificacionSubject = new Subject<any>();

  private notificacionCategoria = new Subject<any>();

  private notificacionRegistroHogar = new Subject<any>();

  constructor(private http: HttpClient,

    private common: CabecerasGenericas,

  ) { }

  private getApiUrl(api: string): string {
    switch (api) {
      case 'Seguimiento':
        return environment.url_MSSeguimiento;
      case 'Authentication':
        return environment.url_MsAuthention;
      case 'Entidad':
        return environment.url_MSEntidad;
      case 'TablaParametrica':
        return environment.url_MSTablasParametricas;
      case 'Permisos':
        return environment.url_MSPermisos;
      case 'NNA':
        return environment.url_MsNna;
      case 'UsuariosRoles':
        return environment.url_MSUsuarioyRoles;
      default:
        return environment.url;
    }
  }

  public getAuth(modulo: string, parameters: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie) {
      return this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.get(`${apiUrl}${modulo}${parameters}`);
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

  public get_withoutParameters(modulo: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.get(`${apiUrl}${modulo}`, { withCredentials: true });
    } else {
      return this.http.get<any[]>(`${apiUrl}${modulo}`);
    }
  }

  public get_withoutParametersAxios(modulo: string): Observable<any[]> {
    return from(axios.get<any[]>(`${this.url}${modulo}`).then(response => response.data));
  }

  public getAxios(modulo: string, params: { [key: string]: any }): Observable<any[]> {
    return from(axios.get<any[]>(`${this.url}${modulo}`, { params }).then(response => response.data));
  }

  public async getAsync(url: string = this.url, modulo: string, parameters: string) {
    return await this.http.get(`${url}${modulo}${parameters}`).toPromise();
  }

  public async getAsyncLocal(url: string) {
    return await this.http.get(`${url}`).toPromise();
  }

  public post(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    return this.http.post(`${apiUrl}${modulo}`, parameters);
  }

  public async postAsync(url: string = this.url, modulo: string, parameters: any) {
    return await this.http.post(`${url}${modulo}`, parameters).toPromise();
  }

  public async postAsyncX(modulo: string, parameters: any) {
    return await this.http.post(`${this.url}${modulo}`, parameters);
  }

  public put(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.put(`${apiUrl}${modulo}`, parameters, { withCredentials: true });
    } else {
      return this.http.put(`${apiUrl}${modulo}`, parameters);
    }
  }

  public putAxios(modulo: string, data: any): Observable<any> {
    return from(axios.put(`${this.url}${modulo}`, data).then(response => response.data));
  }

  public putpromise(modulo: string, parameters: any) {
    return this.http.put(`${this.url}${modulo}`, parameters).toPromise();
  }

  public delete(modulo: string, parameters: string) {
    return this.http.delete(`${this.url}${modulo}${parameters}`);
  }
  public async deleteAsync(modulo: string, parameters: string) {
    return await this.http
      .delete(`${this.url}${modulo}${parameters}`)
      .toPromise();
  }

  async postJson(modulo: string, parameters: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return await this.http.post(
      `${this.url}${modulo}`,
      parameters,
      httpOptions
    );
  }
}
