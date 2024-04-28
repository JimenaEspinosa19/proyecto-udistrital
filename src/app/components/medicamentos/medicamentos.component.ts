import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';


@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {

  medicamentoDisponible: boolean = false;
  mensajeDisponibilidad: string = '';
  Nombre: string = '';
  ciudad: string = ''; 
  medicamentos: any[] = [];
  cantidad: string = '';
  entidad: string = '';
  mensaje: string = '';
  nmedicamento: string = '';
  direcciones: string[] = [];
  direccionSeleccionada: string ="";
  opcionesMedicamentos: any[] = []; 
  medicamentoControl = new FormControl();
  ciudades: string[] = []; 
  entidades: string[] = [];
  eps: string = '';
  epsSeleccionada: string[] = [];
  direccionesFiltradas: string[] = [];
  mostrarBotonesNotificacionYPuntos: boolean = false;
  
  medicamentosFiltrados!: Observable<any[]>;
  entidadesDirecciones: { [entidad: string]: string[] } = {};
  

  constructor(private dataService: DataService, private router: Router) {}

  async ngOnInit() {
    await this.loadCiudades();
    
    this.medicamentosFiltrados = this.medicamentoControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterMedicamentos(value))
    );


    this.opcionesMedicamentos = await this.dataService.getMedicamentos(); 
  }

  async loadCiudades() {
    this.ciudades = await this.dataService.getCiudades();
  }

  private filterMedicamentos(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue || !this.opcionesMedicamentos) {      
      return [];
    }
    return this.opcionesMedicamentos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }

  selectMedicamento(medicamento: any) {
    this.Nombre = medicamento.Nombre; 
    this.medicamentoControl.setValue(medicamento.Nombre); 
  }

  async buscarMedicamento() { 
    console.log('Nombre del medicamento:', this.nmedicamento);
    console.log('Entidad:', this.entidad);
    console.log('Direcciones:', this.direccionSeleccionada);
    console.log('Ciudad:', this.ciudad);
    console.log('Cantidad:', this.cantidad); 

    
    const cantidadNumerica = parseInt(this.cantidad);
    console.log('CANTIDAD FINAL', cantidadNumerica)

   
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
        console.log('La cantidad ingresada no es válida.');
        return; 
    }

    const direccion = this.direccionSeleccionada;
    const medicamentos = await this.dataService.getMedicamentosTodos();

    const medicamentoExistente = medicamentos.find(medicamento =>
        medicamento['nmedicamento'] === this.nmedicamento &&
        medicamento['direcciones'].includes(this.direccionSeleccionada) && 
        medicamento['entidad'] === this.entidad &&
        medicamento['ciudad'] === this.ciudad
    );

    if (medicamentoExistente) {
      if (medicamentoExistente['cantidad'] >= cantidadNumerica) {
          this.dataService.setDatosCliente(this.nmedicamento, this.entidad, this.direccionSeleccionada, this.cantidad);
  
          this.medicamentoDisponible = true;
          this.mensajeDisponibilidad = 'El medicamento está disponible en esta dirección y ciudad.';
      } else {
          this.medicamentoDisponible = false;
          this.mensajeDisponibilidad = 'El medicamento requerido no está disponible. ¿Qué acción desea realizar?';
          this.mostrarBotonesNotificacionYPuntos = true; // Mostrar botones de notificación y otros puntos
      }
  } else {
      this.medicamentoDisponible = false;
      this.mensajeDisponibilidad = 'El medicamento no está disponible en esta dirección y ciudad. ¿Qué acción desea realizar?';
      this.mostrarBotonesNotificacionYPuntos = true; // Mostrar botones de notificación y otros puntos
  }
}


  async reservarMedicamento() {
    this.router.navigate(['/reservas']);
  }

  async onChangeCiudad(event: any) {
    const target = event.target as HTMLSelectElement;
    this.ciudad = target.value;
    console.log("Ciudad seleccionada:", this.ciudad); 
    if (this.ciudad) {
      this.epsSeleccionada = await this.dataService.getEPSByCiudad(this.ciudad);
      this.onChangeEPS(this.eps); 
    }
  }

  async onChangeEPS(eps: string) {
    const ciudadSeleccionada = this.ciudad;
    this.entidades = await this.dataService.getEntidadesPorCiudadYEPS(ciudadSeleccionada, eps);
    this.entidad = this.entidades[0]; 
    this.direccionesFiltradas = await this.dataService.getDireccionesPorEntidadYCiudad(this.entidad, ciudadSeleccionada);
  }
  

  async updateDireccionesFiltradas() {
    const ciudadSeleccionada = this.ciudad;
    this.direccionesFiltradas = await this.dataService.getDireccionesPorEntidadYCiudad(this.entidad, ciudadSeleccionada);
  }

  onChangeEntidad(entidad: string) {
    this.entidad = entidad;
    this.updateDireccionesFiltradas(); 
  }

  async verUbicacion() {
   
  }

  solicitarNotificacion() {
    this.router.navigate(['/notificaciones']);
    
}

 verOtrosPuntosCercanos() {
   
}
}
