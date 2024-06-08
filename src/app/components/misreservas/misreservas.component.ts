import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-misreservas',
  templateUrl: './misreservas.component.html',
  styleUrls: ['./misreservas.component.css']
})


export class MisreservasComponent implements OnInit {
  reservas: any[] = [];
  userID: string | null = null; 

  constructor(private dataService: DataService, private authService: AuthService) { }
  async ngOnInit(): Promise<void> {
    try {
      this.userID = await this.authService.getCurrentUserID(); 
      this.cargarReservas();
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }
  

  cargarReservas() {
    if (this.userID) { 
      if (this.userID === 'mqCqaf7FVXWkEiG1pfegzEYKEFn2') {
        this.dataService.getTodasLasReservas(this.userID).then(reservas => {
          this.reservas = reservas;
          console.log(this.reservas);
        }).catch(error => {
          console.error('Error al cargar todas las reservas:', error);
        });
      } else {
        this.dataService.getReservas(this.userID).then(reservas => {
          this.reservas = reservas;
          console.log(this.reservas);
        }).catch(error => {
          console.error('Error al cargar reservas del usuario actual:', error);
        });
      }
    } else {
      console.error('ID de usuario no disponible');
    }
  }

  cancelarReserva(reservaData: any) {
    if (reservaData) {
      this.dataService.eliminarReserva(reservaData).then(() => {
        console.log('Reserva eliminada correctamente de la base de datos');
      }).catch((error: any) => {
        console.error('Error al eliminar la reserva de la base de datos:', error);
      });
    } else {
      console.error('Los datos de la reserva son undefined');
    }
  }
}

