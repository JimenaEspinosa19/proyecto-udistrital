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
  medicamentosF: any[] =[];
  terminoBusqueda: string = '';
  cantidad: string = '';
  entidad: string = '';
  ciudad: string = '';
  nmedicamento: string = '';

  direcciones: string ="";
  opcionesMedicamentos: any[] = []; 

  ciudades: string[] = []; 
  entidades: string[] = [];


  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentosTodos();
      this.medicamentosFiltrados = [...this.medicamentos];
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

  async TraerMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentos();
      this.medicamentosF = [...this.medicamentos];
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

  buscarMedicamento() {
    this.medicamentosF = this.medicamentos.filter(medicamento =>
      medicamento.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }
    EliminarMedicamento(reservaData: any) {
      if (reservaData) {
        this.dataService.eliminarMedicamento(reservaData).then(() => {
          console.log('Medicamento eliminado correctamente');
        }).catch((error: any) => {
          console.error('Error al eliminar el medicamento:', error);
        });
      } else {
        console.error('Los datos del medicamento son undefined');
      }
    }

    ModificarMedicamento(nmedicamento: string, entidad: string, direccionSeleccionada: string, cantidad: string, ciudad: string) {
      this.dataService.setDatosCliente(nmedicamento, entidad, direccionSeleccionada, cantidad, ciudad);
      console.log("Datos del medicamento seleccionado:", nmedicamento, entidad, this.direcciones, cantidad, ciudad);
      this.router.navigate(['/modificarinventario']);
    }
  }
  



