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
  reservasFiltradas: any[] = [];
  userID: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  loading: boolean = true;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadReservas();
  }

  async loadReservas() {
    try {
      this.userID = await this.authService.getCurrentUserID();
      if (this.userID) {
        const reservasPromise = this.userID === '9lGePCMR5VOdeCyHPQTYhZo5pXV2'
          ? this.dataService.getTodasLasReservas(this.userID)
          : this.dataService.getReservas(this.userID);
        reservasPromise.then(reservas => {
          this.reservas = reservas;
          this.reservasFiltradas = [...this.reservas];
          this.totalPages = Math.ceil(this.reservasFiltradas.length / this.itemsPerPage);
          this.loading = false;
        }).catch(error => {
          console.error('Error al cargar reservas:', error);
        });
      } else {
        console.error('ID de usuario no disponible');
      }
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  cancelarReserva(reservaData: any) {
    if (reservaData) {
      this.dataService.eliminarReserva(reservaData).then(() => {
        console.log('Reserva eliminada correctamente de la base de datos');
        this.loadReservas(); // Refresh the list after deletion
      }).catch((error: any) => {
        console.error('Error al eliminar la reserva de la base de datos:', error);
      });
    } else {
      console.error('Los datos de la reserva son undefined');
    }
  }
}
