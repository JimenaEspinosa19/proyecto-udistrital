import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';

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
  loading: boolean = true; // Variable de estado de carga

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentosTodos();
      this.medicamentosFiltrados = [...this.medicamentos];
      this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    } finally {
      this.loading = false; // Datos cargados, ocultar el indicador de carga
    }
  }

  buscarMedicamento() {
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.nmedicamento.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page after search
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
        this.cargarMedicamentos(); // Refresh the list after deletion
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
}
