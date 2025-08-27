import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Generico {

  private BASE_URL = environment.url_MSSeguimiento;
  private BASE_URL_PARAMETRICAS = environment.url_Parametricas;
  private BASE_URL_USUARIOS = environment.url_MSUsuarioyRoles;

  constructor() {
    // Config global de Axios
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Accept'] = 'application/json';
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

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any
  ): Promise<T | null> {
    const request = axios({ method, url, data });
    return this.handleRequest(request);
  }

  async retorno_post(urltemp: string, data: any, withToken: boolean = true,baseUrl:string = this.BASE_URL): Promise<any> {
    return this.request('post', `${baseUrl}${urltemp}`, data);
  }

  async retorno_get(urltemp: string, baseUrl:string = this.BASE_URL): Promise<any> {
    return this.request('get', `${baseUrl}${urltemp}`);
  }

  async retorno_put(urltemp: string, data: any, withToken: boolean = true): Promise<any> {
    const url = `${this.BASE_URL}${urltemp}`;
    return this.request('put', url, data);
  }

  async retorno_patch(urltemp: string, data: any, withToken: boolean = true): Promise<any> {
    const url = `${this.BASE_URL}${urltemp}`;
    return this.request('patch', url, data);
  }

  async retorno_delete(urltemp: string, withToken: boolean = true): Promise<any> {
    const url = `${this.BASE_URL}${urltemp}`;
    return this.request('delete', url);
  }

  async retorno_post_archivo(urltemp: string, data: any, withToken: boolean = true): Promise<any> {
    const url = `${this.BASE_URL}${urltemp}`;
    const request = axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return this.handleRequest(request);
  }


  async retorno_put_parametrica(urltemp: string, data: any, withToken: boolean = true): Promise<any> {
    const url = `${this.BASE_URL_PARAMETRICAS}${urltemp}`;
    return this.request('put', url, data);
  }

  async retorno_get_parametrica(urltemp: string, baseUrl:string = this.BASE_URL_PARAMETRICAS): Promise<any> {
    const url = `${baseUrl}${urltemp}`;
    return this.request('get', url);
  }
  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }


  async retorno_get_usuarios(urltemp: string, baseUrl:string = this.BASE_URL_USUARIOS): Promise<any> {
    const url = `${baseUrl}${urltemp}`;
    return this.request('get', url);
  }

  async retorno_post_cargue_archivo(urltemp: string, data: any, withToken: boolean = true, baseUrl:string = this.BASE_URL): Promise<any> {
    const url = `${baseUrl}${urltemp}`;
    const request = axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return this.handleRequest(request);
  }

  async retorno_delete_custom(
    urltemp: string,
    baseUrl: string,
    withToken: boolean = true
  ): Promise<any> {
    const url = `${baseUrl}${urltemp}`;
    return this.request('delete', url);
  }
}
