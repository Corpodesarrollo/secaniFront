import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export function getBaseUrl() {
  return environment.url_MsAuthention;
}

// Silenciar console.log/debug/info en builds production (314+ console.log
// dispersos contaminan consola QA/usuario). Mantenemos warn/error para errores reales.
if (environment.production) {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
}

/*bootstrapApplication(AppComponent, AppModule)
  .catch((err) => console.error(err));*/

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
