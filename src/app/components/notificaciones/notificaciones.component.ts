import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  
  nombreCliente: string = '';
  identificacion: string = '';
  cantidad: string ='';
  nmedicamento: string = '';
  entidad: string = '';
  direccionSeleccionada: string = '';
  mensajeDisponibilidad: string = '';
  userEmail: string | null = '';


  constructor(private dataService: DataService, private authService: AuthService) { } 

  ngOnInit(): void {
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });

      const datosCliente = this.dataService.getDatosCliente();
      console.log("Datos recuperados en ngOnInit del componente de notificaciones:", datosCliente);
      if (datosCliente) {
        this.nmedicamento = datosCliente.nmedicamento; 
        this.entidad = datosCliente.entidad;
        this.direccionSeleccionada = datosCliente.direccionSeleccionada;
        this.cantidad = datosCliente.cantidad;
        
      }
    }
    

  async Notificacion() {
    try {
      await this.dataService.crearNotificacion({
        nombreCliente: this.nombreCliente,
        identificacion: this.identificacion,
        nmedicamento: this.nmedicamento,
        cantidad: this.cantidad,
        entidad: this.entidad,
        direccionSeleccionada: this.direccionSeleccionada
      });
      console.log('Datos de notificación guardados correctamente en Firebase.');
      this.mensajeDisponibilidad = 'Notificación enviada correctamente.';
    } catch (error) {
      console.error('Error al guardar datos de notificación en Firebase:', error);
      this.mensajeDisponibilidad = 'Error al enviar la notificación.';
    }
  }
}
