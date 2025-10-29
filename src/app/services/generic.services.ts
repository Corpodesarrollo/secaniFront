import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, from, lastValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';

import { CabecerasGenericas } from './cabecerasGenericas';
import { environment } from '../../environments/environment';

import axios, { AxiosResponse } from 'axios';


@Injectable({
  providedIn: 'root',
})
export class GenericService {

  private url = environment.url_MsAuthention;

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
    const fullUrl = `${apiUrl}${modulo}${parameters}`;

    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.get(fullUrl, options).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en GET:', error);

        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }

        // relanza el error por si el componente necesita manejarlo
        return throwError(() => error);
      })
    );
  }

  public async getAsync(modulo: string, parameters: string, api: string = ''): Promise<any> {
    try {
      const apiUrl = this.getApiUrl(api);
      const fullUrl = `${apiUrl}${modulo}${parameters}`;

      if (environment.cookie) {
        return await lastValueFrom(
          this.http.get(fullUrl, { withCredentials: true })
        );
      } else {
        return await lastValueFrom(
          this.http.get(fullUrl)
        );
      }
    } catch (error: any) {
      console.error('Error en la solicitud:', error);

      if (error.status === 401) {
        console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
        window.location.href = environment.url_Sispro;
      }

      throw error;
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
    const fullUrl = `${apiUrl}${modulo}`;

    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.get<any[]>(fullUrl, options).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en GET (sin parámetros):', error);

        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }

        return throwError(() => error);
      })
    );
  }

  // 🔹 Método usando Axios
  public get_withoutParametersAxios(modulo: string): Observable<any[]> {
    return from(
      axios.get<any[]>(`${this.url}${modulo}`, { withCredentials: environment.cookie })
        .then(response => response.data)
        .catch(error => {
          console.error('Error en Axios (sin parámetros):', error);

          if (error.response && error.response.status === 401) {
            console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
            window.location.href = environment.url_Sispro;
          }

          throw error;
        })
    );
  }

  public getAxios(modulo: string, params: { [key: string]: any }): Observable<any[]> {
    return from(
      axios.get<any[]>(`${this.url}${modulo}`, { params, withCredentials: environment.cookie })
        .then(response => response.data)
        .catch(error => {
          console.error('Error en la solicitud Axios:', error);

          if (error.response && error.response.status === 401) {
            console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
            window.location.href = environment.url_Sispro;
          }

          throw error;
        })
    );
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
    const fullUrl = `${apiUrl}${modulo}`;

    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.post(fullUrl, parameters, options).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si la sesión expiró o no está autorizado
        if (error.status === 401) {
          console.warn('⛔ Sesión no válida. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }

        // Relanzamos el error por si alguien más lo maneja
        return throwError(() => error);
      })
    );
  }

  public async postAsync(url: string = this.url, modulo: string, parameters: any) {
    const fullUrl = `${url}${modulo}`;
    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    console.log('cookie', environment.cookie);

    return this.http.post(fullUrl, parameters, options).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }
        return throwError(() => error);
      })
    );
  }

  public async postAsyncX(modulo: string, parameters: any) {
    const fullUrl = `${this.url}${modulo}`;

    try {
      if (environment.cookie) {
        return await this.http.post(fullUrl, parameters, { withCredentials: true }).toPromise();
      } else {
        return await this.http.post(fullUrl, parameters).toPromise();
      }
    } catch (error: any) {
      if (error.status === 401) {
        console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
        window.location.href = environment.url_Sispro;
      }
      throw error;
    }
  }

  // 🔹 PUT con HttpClient
  public put(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    const fullUrl = `${apiUrl}${modulo}`;

    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.put(fullUrl, parameters, options).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en PUT:', error);
        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }
        return throwError(() => error);
      })
    );
  }

  // 🔹 PUT con Axios
  public putAxios(modulo: string, data: any): Observable<any> {
    return from(
      axios.put(`${this.url}${modulo}`, data, { withCredentials: environment.cookie })
        .then(response => response.data)
        .catch(error => {
          console.error('Error en PUT Axios:', error);
          if (error.response && error.response.status === 401) {
            console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
            window.location.href = environment.url_Sispro;
          }
          throw error;
        })
    );
  }

  // 🔹 PUT con Promesa (toPromise)
  public putpromise(modulo: string, parameters: any) {
    const fullUrl = `${this.url}${modulo}`;
    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.put(fullUrl, parameters, options).toPromise()
      .catch((error: any) => {
        console.error('Error en PUT (promesa):', error);
        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }
        throw error;
      });
  }

  // 🔹 DELETE
  public delete(modulo: string, parameters: string) {
    const fullUrl = `${this.url}${modulo}${parameters}`;
    const options = environment.cookie
      ? { withCredentials: true }
      : {};

    return this.http.delete(fullUrl, options).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en DELETE:', error);
        if (error.status === 401) {
          console.warn('⛔ Sesión expirada o no autenticada. Redirigiendo al login de Sispro...');
          window.location.href = environment.url_Sispro;
        }
        return throwError(() => error);
      })
    );
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

  public deleteWithApi(modulo: string, parameters: string, api: string = ''): Observable<any> {
    const apiUrl = this.getApiUrl(api);
    if (environment.cookie){
      return this.http.delete(`${apiUrl}${modulo}${parameters}`, { withCredentials: true });
    }else{
      return this.http.delete(`${apiUrl}${modulo}${parameters}`);
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
