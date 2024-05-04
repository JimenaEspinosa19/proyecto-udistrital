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
  

  constructor(
    private authService: AuthService,
    private router: Router,
    public dataService: DataService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.readMedicamentos(); 
    this.actualizarCiudades();
    
    this.medicamentosFiltrados = this.medicamentoControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterMedicamentos(value))
    );
  }


  async readMedicamentos() {
    this.medicamentos = await this.dataService.getMedicamentos();
    this.opcionesMedicamentos = this.medicamentos; 
    console.log('Datos de medicamentos:', this.medicamentos);
  }

  private filterMedicamentos(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue) {      
      return [];
    }
    return this.opcionesMedicamentos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
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

  
    const medicamentoExistente = medicamentos.find(medicamento =>
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

       
        try {
            const notificaciones = await this.dataService.getNotificaciones();
            const notificacionExistente = notificaciones.find(notificacion =>
                notificacion['nombre'] === Nombre &&
                notificacion['direccion'] === this.direccionSeleccionada &&
                notificacion['entidad'] === entidad &&
                notificacion['ciudad'] === this.ciudad &&
                parseInt(notificacion['cantidad']) > 1
            );

            if (notificacionExistente) {
                // Si hay coincidencias y la cantidad ingresada es mayor a 1, enviar el correo de notificación
                const asunto = '¡Tu medicamento ya está disponible en DispenAPP!';
                const cuerpo = `El medicamento ${Nombre} ya está disponible en la entidad ${entidad} y la dirección ${this.direccionSeleccionada}. Cantidad disponible: ${notificacionExistente['cantidad']} Reserva en DispenAPP`;
                const correodata = {
                    to: this.userEmail,
                    subject: asunto,
                    message: cuerpo
                };
                this.http.post<any>('https://us-central1-proyecto-final-8e4e0.cloudfunctions.net/mailer', correodata)
                    .subscribe(
                        response => {
                            console.log('Correo de notificación enviado', response);
                        },
                        error => {
                            console.log('Error al enviar correo de notificación', error);
                        }
                    );
            } else {
                this.mensaje = "No hay notificaciones para reportar.";
            }
        } catch (error) {
            console.log('Error al obtener las notificaciones', error);
        }

        this.mensaje = "Medicamento ingresado correctamente.";
    }
}

    
  async actualizarDireccionesPorEntidad(entidad: string) {
    const direcciones = await this.dataService.getDireccionesPorEntidad(entidad);
    if (direcciones && direcciones.length > 0) {
      this.direcciones = Array.from(new Set(direcciones));
    } else {
      this.direcciones = [];
    }
  }

  selectMedicamento(medicamento: any) {
    this.Nombre = medicamento.Nombre; 
    this.medicamentoControl.setValue(medicamento.Nombre); 
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

async onChangeCiudad(event: any) {
  this.ciudad = event?.target?.value;
  if (this.ciudad) {
    this.entidades = await this.dataService.getEntidadesPorCiudad(this.ciudad);
    this.entidad = this.entidades[0]; 
    await this.actualizarDireccionesPorEntidadYCiudad(this.entidad, this.ciudad); 
  }
}


}
