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
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosModule } from './components/modules/usuarios/usuarios.module';
import { TablasParametricas } from './core/services/tablasParametricas';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogNnaMsgSeguimientoComponent } from './components/modules/dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavMenuComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    
  ],
  imports: [
    UsuariosModule,

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

    /**Component standalone */
    
    
],
  providers: [TablasParametricas],
  bootstrap: [AppComponent]
})
export class AppModule { }