import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return environment.url;
}


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
