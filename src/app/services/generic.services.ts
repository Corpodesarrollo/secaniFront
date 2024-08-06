import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';

import { CabecerasGenericas } from './cabecerasGenericas';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root',
})
export class GenericService {

  private url = environment.url;

  private notificacionSubject = new Subject<any>();

  private notificacionCategoria = new Subject<any>();

  private notificacionRegistroHogar = new Subject<any>();

  constructor(private http: HttpClient,
    
    private common: CabecerasGenericas,
    
  ) {}

  private getApiUrl(api: string): string {
    switch (api) {
      case 'Seguimiento':
        return environment.urlMsSeguimiento;
      case 'Authentication':
        return environment.urlMsSeguimiento;
      default:
        return environment.url;
    }
  }

  public get(modulo: string, parameters: string, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    return this.http.get(`${apiUrl}${modulo}${parameters}`);
  }

  public get_withoutParameters(modulo: string) {
    return this.http.get(`${this.url}${modulo}`);
  }

  public async getAsync(modulo: string, parameters: string) {
    return await this.http.get(`${this.url}${modulo}${parameters}`).toPromise();
  }

  public async getAsyncLocal(url: string) {
    return await this.http.get(`${url}`).toPromise();
  }

  public post(modulo: string, parameters: any, api: string = '') {
    const apiUrl = this.getApiUrl(api);
    return this.http.post(`${apiUrl}${modulo}`, parameters);
  }

  public async postAsync(modulo: string, parameters: any) {
    return await this.http.post(`${this.url}${modulo}`, parameters).toPromise();
  }

  public async postAsyncX(modulo: string, parameters: any) {
    return await this.http.post(`${this.url}${modulo}`, parameters);
  }

  public put(modulo: string, parameters: any) {
    return this.http.put(`${this.url}${modulo}`, parameters);
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
