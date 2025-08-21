import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, from, lastValueFrom } from 'rxjs';
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

  public get(modulo: string, parameters: string, api: string = ''): Observable<any> {
    const apiUrl = this.getApiUrl(api);
    const url = `${apiUrl}${modulo}${parameters}`;

    const fetchOptions: RequestInit = {
      method: 'GET',
      credentials: environment.cookie ? 'include' : 'same-origin'
    };

    const fetchPromise = fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          // Aquí ya tienes un error HTTP (404, 500, etc.)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      });

    return from(fetchPromise).pipe(
      catchError((err) => {
        console.error('Error en fetch:', err);
        return throwError(() => err);
      })
    );
  }

  public async getAsync(modulo: string, parameters: string, api: string = ''): Promise<any> {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie) {
      return await lastValueFrom(this.http.get(`${apiUrl}${modulo}${parameters}`, { withCredentials: true }));
    } else {
      return await lastValueFrom(this.http.get(`${apiUrl}${modulo}${parameters}`));
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
    return await this.http.get(`${url}`).toPromise();
  }

  public post(modulo: string, parameters: any, api: string = ''): Observable<any> {
    const apiUrl = this.getApiUrl(api);
    const url = `${apiUrl}${modulo}`;

    const fetchOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify(parameters),
      credentials: environment.cookie ? 'include' : 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const fetchPromise = fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json(); // o .text() si no es JSON
      });

    return from(fetchPromise).pipe(
      catchError((err) => {
        console.error('Error en fetch POST:', err);
        return throwError(() => err);
      })
    );
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
    if (environment.cookie){
      return this.http.delete(`${this.url}${modulo}${parameters}`, { withCredentials: true });
    }else{
      return this.http.delete(`${this.url}${modulo}${parameters}`);
    }
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
