import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Generico {

  private BASE_URL = environment.url_MSSeguimiento;
  private headers: any = '';
  private headersWithoutToken: any = '';

  private BASE_URL_PARAMETRICAS = environment.url_Parametricas;

  private BASE_URL_USUARIOS = environment.url_MSUsuarioyRoles;

  constructor() {
    const token = localStorage.getItem("access_token");
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
    this.headersWithoutToken = {
      'Content-Type': 'application/json',
    };
  }

  private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T | null> {

    try {
      const response = await request;

      return response.data;
    } catch (error: any) {

      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else {
        console.error('Error:', error.message);
      }
      return null;
    }
  }

  private async headersWithToken(): Promise<any> {
    const token = localStorage.getItem("access_token") || undefined;
    return {
      ...this.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async headersWithoutTokenFn(): Promise<any> {
    return this.headersWithoutToken;
  }



  async retorno_post(urltemp: string, data: any, withToken: boolean = true,baseUrl:string = this.BASE_URL): Promise<any> {



    const headers = withToken ? await this.headersWithToken() : await this.headersWithoutTokenFn();
    const url = `${baseUrl}${urltemp}`;
    const request = axios.post(url, data, { headers });
    return this.handleRequest(request);
  }

  async retorno_get(urltemp: string, baseUrl:string = this.BASE_URL): Promise<any> {

    const headers = await this.headersWithToken();
    const url = `${baseUrl}${urltemp}`;
    const request = axios.get(url, { headers });
    return this.handleRequest(request);
  }

  async retorno_put(urltemp: string, data: any, withToken: boolean = true): Promise<any> {



    const headers = withToken ? await this.headersWithToken() : await this.headersWithoutTokenFn();
    const url = `${this.BASE_URL}${urltemp}`;
    const request = axios.put(url, data, { headers });
    return this.handleRequest(request);
  }

  async retorno_patch(urltemp: string, data: any, withToken: boolean = true): Promise<any> {



    const headers = withToken ? await this.headersWithToken() : await this.headersWithoutTokenFn();
    const url = `${this.BASE_URL}${urltemp}`;
    const request = axios.patch(url, data, { headers });
    return this.handleRequest(request);
  }

  async retorno_delete(urltemp: string, withToken: boolean = true): Promise<any> {



    const headers = withToken ? await this.headersWithToken() : await this.headersWithoutTokenFn();
    const url = `${this.BASE_URL}${urltemp}`;
    const request = axios.delete(url, { headers });
    return this.handleRequest(request);
  }

  async retorno_post_archivo(urltemp: string, data: any, withToken: boolean = true): Promise<any> {



    const headers = withToken ? await this.headersWithToken() : await this.headersWithoutTokenFn();
    const url = `${this.BASE_URL}${urltemp}`;
    const request = axios.post(url, data, { headers });
    return this.handleRequest(request);
  }


  async retorno_get_parametrica(urltemp: string, baseUrl:string = this.BASE_URL_PARAMETRICAS): Promise<any> {

    const headers = await this.headersWithToken();
    const url = `${baseUrl}${urltemp}`;
    const request = axios.get(url, { headers });
    return this.handleRequest(request);
  }
  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }


  async retorno_get_usuarios(urltemp: string, baseUrl:string = this.BASE_URL_USUARIOS): Promise<any> {

    const headers = await this.headersWithToken();
    const url = `${baseUrl}${urltemp}`;
    const request = axios.get(url, { headers });
    return this.handleRequest(request);
  }
  // Método para verificar si un campo está vacío

}
