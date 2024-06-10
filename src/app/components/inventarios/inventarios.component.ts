import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  loading: boolean = true;
  userID: string | null = null;

  constructor(private dataService: DataService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserID();
    this.cargarMedicamentos();
    this.updateItemsPerPage(); // Actualiza items por página basado en tamaño de la pantalla
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

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentosTodos();
      this.medicamentosFiltrados = [...this.medicamentos];
      this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    } finally {
      this.loading = false;
    }
  }

  buscarMedicamento() {
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.nmedicamento.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
    this.currentPage = 1;
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

  EliminarMedicamento(reservaData: any) {
    if (reservaData) {
      this.dataService.eliminarMedicamento(reservaData).then(() => {
        console.log('Medicamento eliminado correctamente');
        this.cargarMedicamentos();
      }).catch((error: any) => {
        console.error('Error al eliminar el medicamento:', error);
      });
    } else {
      console.error('Los datos del medicamento son undefined');
    }
  }

  ModificarMedicamento(nmedicamento: string, entidad: string, direccionSeleccionada: string, cantidad: string, ciudad: string) {
    this.dataService.setDatosCliente(nmedicamento, entidad, direccionSeleccionada, cantidad, ciudad);
    console.log("Datos del medicamento seleccionado:", nmedicamento, entidad, direccionSeleccionada, cantidad, ciudad);
    this.router.navigate(['/modificarinventario']);
  }

  updateItemsPerPage() {
    if (window.innerWidth <= 600) {
      this.itemsPerPage = 1; 
    } else {
      this.itemsPerPage = 10; 
    }
    this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
  }
}