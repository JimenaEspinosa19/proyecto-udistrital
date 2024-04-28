import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

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
  fechaReserva: string = '';
  horaReserva: string = '';
  mensajeDisponibilidad: string = '';

  constructor(private dataService: DataService) { } 

  ngOnInit(): void {
    const datosCliente = this.dataService.getDatosCliente();
    console.log("Datos recuperados en ngOnInit del componente de reservas:", datosCliente);
    if (datosCliente) {
        this.nmedicamento = datosCliente.nmedicamento; 
        this.entidad = datosCliente.entidad;
        this.cantidad = datosCliente.cantidad;
        this.direccionSeleccionada = datosCliente.direcciones;
    }
}

  async Notificacion() {
    
      
  }
}

