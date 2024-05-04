import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { MisreservasComponent } from './components/misreservas/misreservas.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { VerificacioncorreoComponent } from './components/verificacioncorreo/verificacioncorreo.component';
import { GeolocalizacionComponent } from './components/geolocalizacion/geolocalizacion.component';
import { ProximosaVencerComponent } from './components/proximosa-vencer/proximosa-vencer.component';
import { MedicamentosvencerComponent } from './components/medicamentosvencer/medicamentosvencer.component';
import { DoblefactorComponent } from './components/doblefactor/doblefactor.component';
import { PuntoscercanosComponent } from './components/puntoscercanos/puntoscercanos.component';
import { GeolocalizacionPuntosComponent } from './components/geolocalizacion-puntos/geolocalizacion-puntos.component';
import { ModificarinventarioComponent } from './components/modificarinventario/modificarinventario.component';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verificacion', component: VerificacioncorreoComponent,canActivate: [AuthGuard] },
  { path: 'doblefactor', component: DoblefactorComponent,canActivate: [AuthGuard] },

  { 
    path: '', 
    component: EncabezadoComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'medicamentos', component: MedicamentosComponent, canActivate: [AuthGuard] },
      { path: 'reservas', component: ReservasComponent,canActivate: [AuthGuard] },
      { path: 'registrar', component: RegistrarComponent,canActivate: [AuthGuard] },
      { path: 'inventarios', component: InventariosComponent,canActivate: [AuthGuard] },
      { path: 'misreservas', component: MisreservasComponent,canActivate: [AuthGuard] },
      { path: 'notificaciones', component: NotificacionesComponent,canActivate: [AuthGuard] },
      {path: 'localizacion', component: GeolocalizacionComponent,canActivate: [AuthGuard] },
      {path: 'vencimiento', component: ProximosaVencerComponent, canActivate: [AuthGuard] },
      {path: 'proximosvencer', component: MedicamentosvencerComponent, canActivate: [AuthGuard] },
      {path: 'otrospuntos', component: PuntoscercanosComponent, canActivate: [AuthGuard] },
      {path: 'localizacion2', component: GeolocalizacionPuntosComponent,canActivate: [AuthGuard] },
      {path: 'modificarinventario', component:ModificarinventarioComponent ,canActivate: [AuthGuard] },
      
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
