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

  private url = environment.url;

  private notificacionSubject = new Subject<any>();

  private notificacionCategoria = new Subject<any>();

  private notificacionRegistroHogar = new Subject<any>();

  constructor(private http: HttpClient,
    
    private common: CabecerasGenericas,
    
  ) {}

  public get(modulo: string, parameters: string) {
    return this.http.get<any[]>(`${this.url}${modulo}${parameters}`);
  }

  public get_withoutParameters(modulo: string) {
    return this.http.get<any[]>(`${this.url}${modulo}`);
  }

  public get_withoutParametersAxios(modulo: string): Observable<any[]> {
    return from(axios.get<any[]>(`${this.url}${modulo}`).then(response => response.data));
  }

  public getAxios(modulo: string, params: { [key: string]: any }): Observable<any[]> {
    return from(axios.get<any[]>(`${this.url}${modulo}`, { params }).then(response => response.data));
  }

  public async getAsync(modulo: string, parameters: string) {
    return await this.http.get(`${this.url}${modulo}${parameters}`).toPromise();
  }

  public async getAsyncLocal(url: string) {
    return await this.http.get(`${url}`).toPromise();
  }

  public post(modulo: string, parameters: any) {
    return this.http.post(`${this.url}${modulo}`, parameters);
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
