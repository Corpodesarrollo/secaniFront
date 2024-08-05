import { Injectable } from '@angular/core';
import axios  from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CabecerasGenericas {

  BASE_URL = environment.url_MsAuthention;

  private headers_service: any = '';

  constructor(){
    this.obtnerCabeceras();
  }

  obtnerCabeceras(){
    var token = localStorage.getItem("access_token");
    this.headers(token!);
  }

  headers = async (token?: string) => {
    this.headers_service = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.headers_service;
  };

  async retorno_post(urltemp: string, data: any){
    const url = this.BASE_URL + urltemp;
    if(this.headers_service.Authorization === 'Bearer null'){
      this.obtnerCabeceras();
    }
    let retorno = await axios
      .post(url, data, {
        headers: this.headers_service,
      })
      .then((response) => response.data)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });;
    return retorno;
  }

  async retorno_get(urltemp: string, baseUrl:string = this.BASE_URL){
    const url = baseUrl + urltemp;
    if(this.headers_service.Authorization === 'Bearer null'){
      this.obtnerCabeceras();
    }
    let retorno = await axios
      .get(url, {
        headers: this.headers_service,
      })
      .then((response) => response.data)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    return retorno;
  }

  async retorno_put(urltemp: string, data: any){
    const url = this.BASE_URL + urltemp;
    if(this.headers_service.Authorization === 'Bearer null'){
      this.obtnerCabeceras();
    }
    let retorno = await axios
      .put(url, data, {
        headers: this.headers_service,
      })
      .then((response) => response.data)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });;
    return retorno;
  }

  async retorno_get_blob(urltemp: string){
    const url = this.BASE_URL + urltemp;
    if(this.headers_service.Authorization === 'Bearer null'){
      this.obtnerCabeceras();
    }
    let retorno = await axios
      .get(url, {
        headers: this.headers_service,
        responseType: 'blob'
      })
      .then((response) => response.data.blob())
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    return retorno;
  }

  async retorno_delete(urltemp: string){
    const url = this.BASE_URL + urltemp;
    if(this.headers_service.Authorization === 'Bearer null'){
      this.obtnerCabeceras();
    }
    let retorno = await axios
      .delete(url,  {
        headers: this.headers_service,
      })
      .then((response) => response.data)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });;
    return retorno;
  }

}

