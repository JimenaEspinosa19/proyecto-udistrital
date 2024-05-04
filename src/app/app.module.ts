
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
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MisreservasComponent } from './components/misreservas/misreservas.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { VerificacioncorreoComponent } from './components/verificacioncorreo/verificacioncorreo.component';
import { GeolocalizacionComponent } from './components/geolocalizacion/geolocalizacion.component';
import { ProximosaVencerComponent } from './components/proximosa-vencer/proximosa-vencer.component';
import { MedicamentosvencerComponent } from './components/medicamentosvencer/medicamentosvencer.component';
import { DoblefactorComponent } from './components/doblefactor/doblefactor.component';
import { PuntoscercanosComponent } from './components/puntoscercanos/puntoscercanos.component';
import { GeolocalizacionPuntosComponent } from './components/geolocalizacion-puntos/geolocalizacion-puntos.component';
import { HttpClientModule } from '@angular/common/http';
import { ModificarinventarioComponent } from './components/modificarinventario/modificarinventario.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    MedicamentosComponent,
    EncabezadoComponent,
    InventariosComponent,
    ReservasComponent,
    RegistrarComponent,
    MisreservasComponent,
    NotificacionesComponent,
    VerificacioncorreoComponent,
    GeolocalizacionComponent,
    ProximosaVencerComponent,
    MedicamentosvencerComponent,
    DoblefactorComponent,
    PuntoscercanosComponent,
    GeolocalizacionPuntosComponent,
    ModificarinventarioComponent,

  
    
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
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),

    // error solution NullInjectError
    AngularFireModule.initializeApp(environment.firebase),
      BrowserAnimationsModule
  ],
  providers: [Router],
  bootstrap: [AppComponent]
})
export class AppModule { }