import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class HealthCheckInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/health')) {
      const response = new HttpResponse({
        status: 200,
        body: {
          status: 'Frontend funcionando correctamente',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
      return of(response);
    }
    return next.handle(req);
  }
}