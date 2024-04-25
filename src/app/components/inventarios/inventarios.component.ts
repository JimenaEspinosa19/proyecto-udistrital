import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  terminoBusqueda: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentos();
      this.medicamentosFiltrados = [...this.medicamentos];
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

  buscarMedicamento() {
    this.medicamentosFiltrados = this.medicamentos.filter(medicamento =>
      medicamento.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    
  }
  async eliminarMedicamento(index: number) {
    const medicamentoAEliminar = this.medicamentosFiltrados[index];
    try {
     
      await this.dataService.eliminarMedicamento(medicamentoAEliminar.id);
    
      this.medicamentosFiltrados.splice(index, 1);
    } catch (error) {
      console.error("Error al eliminar el medicamento:", error);
    }
  }

  

}


