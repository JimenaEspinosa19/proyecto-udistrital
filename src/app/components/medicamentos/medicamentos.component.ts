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
  mensajeError: string = '';
  direccionSeleccionadaSeleccionada: boolean = false;
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
    if (this.ciudades.length > 0) {
      const primeraCiudad = this.ciudades[0];
      await this.actualizarEntidadesYDirecciones(primeraCiudad);
    }
    this.medicamentosFiltrados = this.medicamentoControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterMedicamentos(value))
    );
    this.opcionesMedicamentos = await this.dataService.getMedicamentos(); 
  }
  
  async actualizarEntidadesYDirecciones(ciudad: string) {
    this.ciudad = ciudad;
    this.epsSeleccionada = await this.dataService.getEPSByCiudad(ciudad);
    if (this.epsSeleccionada.length > 0) {
      await this.onChangeEPS(this.epsSeleccionada[0]);
    }
    if (this.entidades.length > 0) {
      this.entidad = this.entidades[0]; 
      await this.updateDireccionesFiltradas(); 
      if (this.direccionesFiltradas.length > 0) {
        this.direccionSeleccionada = this.direccionesFiltradas[0]; 
      }
    }
  }
  
  async loadCiudades() {
    this.ciudades = await this.dataService.getCiudades();
  }

  private filterMedicamentos(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue || !this.opcionesMedicamentos) {      
        return [];
    }  
    const MAX_MEDICAMENTOS = 3; 
    const medicamentosFiltrados = this.opcionesMedicamentos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
   
    return medicamentosFiltrados.slice(0, MAX_MEDICAMENTOS); 
}


  selectMedicamento(medicamento: any) {
    this.Nombre = medicamento.Nombre; 
    this.medicamentoControl.setValue(medicamento.Nombre); 
    


  }

  
  async buscarMedicamento() { 
    if (!this.nmedicamento || !this.entidad || !this.direccionSeleccionada || !this.ciudad || !this.cantidad) {
      this.mensajeError = 'Todos los campos deben estar llenos.';
      console.log('Todos los campos deben estar llenos.');
      return; 
    }
  
    const cantidadNumerica = parseInt(this.cantidad);
    console.log('CANTIDAD FINAL', cantidadNumerica)
  
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      this.mensajeError = 'La cantidad del medicamento no es valida,';
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
        this.dataService.setDatosCliente(this.nmedicamento, this.entidad, this.direccionSeleccionada, this.cantidad, this.ciudad);
        this.medicamentoDisponible = true;
        this.mensajeDisponibilidad = 'El medicamento está disponible en esta dirección y ciudad.';
    
        this.mensajeError = '';
      } else {
        this.dataService.setDatosCliente(this.nmedicamento, this.entidad, this.direccionSeleccionada, this.cantidad,this.ciudad);
        this.medicamentoDisponible = false;
        this.mensajeDisponibilidad = 'El medicamento requerido no está disponible. ¿Qué acción desea realizar?';
        this.mostrarBotonesNotificacionYPuntos = true; 
      }
    } else {
      this.dataService.setDatosCliente(this.nmedicamento, this.entidad, this.direccionSeleccionada, this.cantidad,this.ciudad);
      this.medicamentoDisponible = false;
      this.mensajeDisponibilidad = 'El medicamento no está disponible en esta dirección y ciudad. ¿Qué acción desea realizar?';
      this.mostrarBotonesNotificacionYPuntos = true; 
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
      await this.onChangeEPS(this.epsSeleccionada[0]); 
      await this.updateDireccionesFiltradas(); 
    }
  }
  
  
  async onChangeEPS(eps: string) {
    const ciudadSeleccionada = this.ciudad;
    this.entidades = await this.dataService.getEntidadesPorCiudadYEPS(ciudadSeleccionada, eps);
    if (this.entidades.length > 0) {
      this.entidad = this.entidades[0]; 
      await this.updateDireccionesFiltradas();
    }
  }
  
  

  async updateDireccionesFiltradas() {
  if (this.entidad && this.ciudad) {
    this.direccionesFiltradas = await this.dataService.getDireccionesPorEntidadYCiudad(this.entidad, this.ciudad);
  }
}


  onChangeEntidad(entidad: string) {
    this.entidad = entidad;
    this.updateDireccionesFiltradas(); 
  }

  //
     async verUbicacion() {
    const ubicacion = this.direccionSeleccionada;
    console.log('ubicacion seleccionada',ubicacion)
    return (ubicacion)
    
    }

  //
  solicitarNotificacion() {
    this.router.navigate(['/notificaciones']);
    
}
verOtrosPuntosCercanos() {
  
      this.router.navigate(['/otrospuntos']);
    
}

enviarDireccionALocalizacion() {

  if (this.direccionSeleccionada) {
   
    this.router.navigate(['/localizacion'], { state: { direccionSeleccionada: this.direccionSeleccionada } });
  } else {
    
    console.log("No se ha seleccionado ninguna dirección.");
  }
}
}
