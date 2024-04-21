import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { MenuComponent } from './components/menu/menu.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    MedicamentosComponent,
    EncabezadoComponent,
    MenuComponent,
    PerfilComponent,
    InventariosComponent,
    ReservasComponent,
    RegistrarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),

    // error solution NullInjectError
    AngularFireModule.initializeApp(environment.firebase),
      BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
