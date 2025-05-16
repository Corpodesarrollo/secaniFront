import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { routes } from './app.routes';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ContentComponent } from './components/content/content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosModule } from './components/modules/usuarios/usuarios.module';
import { TablasParametricas } from './core/services/tablasParametricas';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogNnaMsgSeguimientoComponent } from './components/modules/dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HealthCheckInterceptor } from './interceptors/health-check.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavMenuComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LayoutComponent,
    LayoutSecondaryComponent
  ],
  imports: [

    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,

    /** PrimeNG */
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    TableModule,
    ProgressSpinnerModule,
    InputTextModule,
    CalendarModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,

    /**Component standalone */


  ],
  providers: [TablasParametricas,
    DialogService,
    { provide: HTTP_INTERCEPTORS, useClass: HealthCheckInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
