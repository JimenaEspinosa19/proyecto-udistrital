import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-medicamentosvencer',
  templateUrl: './medicamentosvencer.component.html',
  styleUrls: ['./medicamentosvencer.component.css']
})

export class MedicamentosvencerComponent implements OnInit {
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  medicamentosF: any[] =[];
  terminoBusqueda: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getEntregarapida();
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

    EliminarMedicamento(reservaData: any) {
      if (reservaData) {
        this.dataService.eliminarMedicamentoVencer(reservaData).then(() => {
          console.log('Medicamento eliminado correctamente');
        }).catch((error: any) => {
          console.error('Error al eliminar el medicamento:', error);
        });
      } else {
        console.error('Los datos del medicamento son undefined');
      }
    }
  }