import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent {
  sidenav: any;
  userID: string | null = null; // Declara la variable userID y asigna null inicialmente

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() { // Utiliza ngOnInit para cargar el userID cuando el componente esté listo
    await this.loadUserID();
  }

  async loadUserID() {
    try {
      this.userID = await this.authService.getCurrentUserID();
      if (!this.userID) {
        console.error('ID de usuario no disponible');
      }
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  logOut() {
    this.authService.logOut();
  }
}
