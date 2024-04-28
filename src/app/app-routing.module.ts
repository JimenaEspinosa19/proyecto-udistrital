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






const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
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
    
      
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
