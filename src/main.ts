import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

export function getBaseUrl() {
  return environment.url_MsAuthention;
}


/*bootstrapApplication(AppComponent, AppModule)
  .catch((err) => console.error(err));*/

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));

  