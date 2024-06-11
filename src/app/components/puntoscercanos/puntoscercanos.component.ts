import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-puntoscercanos',
  templateUrl: './puntoscercanos.component.html',
  styleUrls: ['./puntoscercanos.component.css']
})
export class PuntoscercanosComponent implements OnInit {
[x: string]: any;
  direccionesDisponibles: any[] = [];
  cantidad: string ='';
  nmedicamento: string = '';
  entidad: string = '';
  direccionSeleccionada: string = '';
  mensajeDisponibilidad: string = '';
  userEmail: string | null = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  medicamentosFiltrados: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.getPuntosCercanos();
    this.updateItemsPerPage();
  }

  async getPuntosCercanos() {
    try {
  
        const cliente = this.dataService.getDatosCliente();
  
        const medicamentos = await this.dataService.getMedicamentosTodos();
      
  
        const direccionesDisponibles: any[] = [];
  
        const { nmedicamento, ciudad, entidad, cantidad } = cliente;
        const medicamentosFiltrados = medicamentos.filter(medicamento =>
            medicamento['nmedicamento'].toLowerCase() === nmedicamento.toLowerCase() &&
            medicamento['ciudad'] === ciudad &&
            medicamento['entidad'] === entidad &&
            medicamento['cantidad'] >= cantidad
        );
  
  
        medicamentosFiltrados.forEach(medicamento => {
            medicamento['direcciones'].forEach((direccion: any) => {
                direccionesDisponibles.push({
                    direccion: direccion,
                    nmedicamento: medicamento['nmedicamento'],
                    ciudad: medicamento['ciudad'],
                    entidad: medicamento['entidad'],
                    cantidad: medicamento['cantidad']
                });
            });
        });
  
        this.direccionesDisponibles = direccionesDisponibles;
        this.updateItemsPerPage();
    } catch (error) {
        console.error('Error al obtener las direcciones disponibles:', error);
    }
}

  
  volverAMedicamentos() {
    this.router.navigate(['/medicamentos']);
  }

  guardarDireccionSeleccionada(direccion: any) {
    this.direccionSeleccionada = direccion.direccion;
    console.log('Dirección seleccionada:', this.direccionSeleccionada);

    if (this.direccionSeleccionada) {
   
      this.router.navigate(['/localizacion2'], { state: { direccionSeleccionada: this.direccionSeleccionada } });
    } else {
      
      console.log("No se ha seleccionado ninguna dirección.");
    }
  }

  updateItemsPerPage() {
    if (window.innerWidth <= 600) {
      this.itemsPerPage = 1; 
    } else {
      this.itemsPerPage = 5; 
    }
    this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
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
}
  
