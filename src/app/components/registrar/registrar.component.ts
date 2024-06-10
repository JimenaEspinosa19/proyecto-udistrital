import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {

  Nombre: string = '';
  ciudad: string = ''; 
  medicamentos: any;
  cantidad: string = '';
  entidad: string = '';
  mensaje: string = '';
  nmedicamento: string = '';
  direcciones: string[] = [];
  direccionSeleccionada: string = '';
  opcionesMedicamentos: any[] = [];
  medicamentoControl = new FormControl();
  ciudades: string[] = []; 
  entidades: string[] = []
  medicamentosFiltrados!: Observable<any[]>;
  entidadesDirecciones: { [entidad: string]: string[] } = {};
  userEmail: string | null = '';
  mostrarOpciones: boolean = true;
  medicamentoDisponible: boolean = false;
  mensajeDisponibilidad: string = '';
  mensajeError: string = '';
  direccionSeleccionadaSeleccionada: boolean = false;
  eps: string = '';
  epsSeleccionada: string[] = [];
  direccionesFiltradas: string[] = [];
  mostrarBotonesNotificacionYPuntos: boolean = false;

  
  

  constructor(
    private authService: AuthService,
    private router: Router,
    public dataService: DataService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
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
  
    const MAX_MEDICAMENTOS = 1; 
    const medicamentosFiltrados = this.opcionesMedicamentos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    return medicamentosFiltrados.slice(0, MAX_MEDICAMENTOS);
    
}


  selectMedicamento(medicamento: any) {
    this.Nombre = medicamento.Nombre;
    this.medicamentoControl.setValue(medicamento.Nombre, { emitEvent: false });
    this.mostrarOpciones = false; 
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


async addMedicament(Nombre: string, cantidad: string, entidad: string) {
  console.log('Nombre:', Nombre);
  console.log('Cantidad:', cantidad);
  console.log('Dirección seleccionada:', this.direccionSeleccionada);
  console.log('Entidad:', entidad);
  console.log('Ciudad seleccionada:', this.ciudad);

  if (!Nombre || !cantidad || !this.direccionSeleccionada || !entidad || !this.ciudad) {
      this.mensaje = "Por favor, complete todos los campos.";
      return;
  }

  const direccion = this.direccionSeleccionada;
  const medicamentos = await this.dataService.getMedicamentosTodos();

  let medicamentoExistente = medicamentos.find(medicamento =>
      medicamento['nmedicamento'] === Nombre &&
      medicamento['direcciones'].includes(this.direccionSeleccionada) &&
      medicamento['entidad'] === entidad &&
      medicamento['ciudad'] === this.ciudad
  );

  if (medicamentoExistente) {
      medicamentoExistente['cantidad'] = parseInt(medicamentoExistente['cantidad']) + parseInt(cantidad);
      await this.dataService.updateMedicament(medicamentoExistente);
      this.mensaje = `Se agregaron ${cantidad} medicamentos al existente. Total: ${medicamentoExistente['cantidad']}`;
  } else {
      await this.dataService.createmedicament(Nombre, cantidad, [this.direccionSeleccionada], entidad, this.ciudad);
      this.mensaje = "Medicamento ingresado correctamente.";
  }

  try {
      const notificaciones = await this.dataService.getNotificaciones();
      console.log('Notificaciones:', notificaciones);

      const notificacionExistente = notificaciones.find(notificacion =>
          notificacion['nmedicamento'] === Nombre &&
          notificacion['direccionSeleccionada'] === this.direccionSeleccionada &&
          notificacion['entidad'] === entidad &&
          notificacion['ciudad'] === this.ciudad &&
          parseInt(cantidad) >= parseInt(notificacion['cantidad'])
      );

      if (notificacionExistente) {
        
          const asunto = 'Tu medicamento ya está disponible en dispenAPP';
          const cuerpo = `Tu medicamento ${Nombre} ya está disponible en ${entidad}, dirección ${this.direccionSeleccionada}. Reserva en DispenAPP antes de que se agote nuevamente.`;
          const correodata = {
              to: this.userEmail,
              subject: asunto,
              message: cuerpo
          };

          this.http.post<any>('https://us-central1-proyecto-final-8e4e0.cloudfunctions.net/mailer', correodata)
              .subscribe(
                  response => {
                      console.log('Correo enviado', response);
                      this.mensaje = "Medicamento ingresado correctamente.";

                    
                      this.dataService.eliminarNotificacion(notificacionExistente).then(() => {
                         console.log('Notificación eliminada después de enviar el correo.');
                      }).catch(error => {
                          console.log('Error al eliminar la notificación:', error);
                      });
                  },
                  error => {
                      console.log('Error al enviar correo', error);
                      this.mensaje = "Error al enviar el correo de notificación.";
                  }
              );
      } else {
          console.log("No hay notificaciones para reportar.");
      }
  } catch (error) {
      console.log('Error al obtener las notificaciones', error);
      this.mensaje = "Error al obtener las notificaciones.";
  }
} 


async actualizarDireccionesPorEntidadYCiudad(entidad: string, ciudad: string) {
  const direcciones = await this.dataService.getDireccionesPorEntidadYCiudad(entidad, ciudad);
  this.direcciones = Array.from(new Set(direcciones)); 
  this.entidadesDirecciones[entidad] = direcciones;
  console.log('Direcciones de', entidad, 'en', ciudad, ':', this.direcciones);
}



async actualizarCiudades() {
  this.ciudades = await this.dataService.getCiudades();
}




}
