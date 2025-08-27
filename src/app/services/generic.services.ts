import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, from, lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';

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

  ) {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Accept'] = 'application/json';
   }

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
    console.log("cookie", environment.cookie);
    if (environment.cookie) {
      console.log(this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true }));
      return this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.get(`${apiUrl}${modulo}${parameters}`);
    }
  }

  public get(modulo: string, parameters: string, api: string = ''): Observable<any> {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.get(`${apiUrl}${modulo}${parameters}`);
    }
  }

  public async getAsync(modulo: string, parameters: string, api: string = ''): Promise<any> {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    } else {
      return this.http.get(`${apiUrl}${modulo}${parameters}`);
    }
  }

  public async getFile(modulo: string, parameters: string, api: string = ''): Promise<Blob> {
    const apiUrl = this.getApiUrl(api);
    const url = `${apiUrl}${modulo}/${parameters}`; // ✅ Agregar slash entre modulo y parameters
    
    const options = {
      responseType: 'blob' as 'json', // ✅ Siempre responseType blob
      withCredentials: environment.cookie ? true : undefined
    };

    try {
      return await lastValueFrom(this.http.get<Blob>(url, options));
    } catch (error) {
      console.error('Error en getFile:', error);
      throw error;
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

  public async getAsyncLocal(url: string) {
    if (environment.cookie){
      return await this.http.get(`${url}`, { withCredentials: true }).toPromise();
    } else {
      return await this.http.get(`${url}`).toPromise();
    }
  }

  public post(modulo: string, parameters: any, api: string = ''): Observable<any> {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.post(`${apiUrl}${modulo}`, parameters, { withCredentials: true });
    } else {
      return this.http.post(`${apiUrl}${modulo}`, parameters);
    }
  }

  public async postAsync(url: string = this.url, modulo: string, parameters: any) {
    if (environment.cookie){
      console.log('cookie', environment.cookie);
      return this.http.post(`${url}${modulo}`, parameters, { withCredentials: true });
    } else {
      console.log('cookie', environment.cookie);
      return this.http.post(`${url}${modulo}`, parameters);
    }
  }

  public async postAsyncX(modulo: string, parameters: any) {
    if (environment.cookie){
      return await this.http.post(`${this.url}${modulo}`, parameters, { withCredentials: true });
    } else {
      return await this.http.post(`${this.url}${modulo}`, parameters);
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

  public putAxios(modulo: string, data: any): Observable<any> {
    return from(axios.put(`${this.url}${modulo}`, data).then(response => response.data));
  }

  public putpromise(modulo: string, parameters: any) {
    if (environment.cookie){
      return this.http.put(`${this.url}${modulo}`, parameters, { withCredentials: true }).toPromise();
    } else {
      return this.http.put(`${this.url}${modulo}`, parameters).toPromise();
    }
  }

  public delete(modulo: string, parameters: string) {
    if (environment.cookie){
      return this.http.delete(`${this.url}${modulo}${parameters}`, { withCredentials: true });
    }else{
      return this.http.delete(`${this.url}${modulo}${parameters}`);
    }
  }
  public async deleteAsync(modulo: string, parameters: string) {
    if (environment.cookie){
      return await this.http
      .delete(`${this.url}${modulo}${parameters}`, { withCredentials: true })
      .toPromise();
    } else{
      return await this.http
      .delete(`${this.url}${modulo}${parameters}`)
      .toPromise();
    }
  }

  async postJson(modulo: string, parameters: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    };
    return await this.http.post(
      `${this.url}${modulo}`,
      parameters,
      httpOptions
    );
  }
}
