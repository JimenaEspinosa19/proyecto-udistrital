import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  
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
        this.direccionSeleccionada = datosCliente.direccionSeleccionada;
    }
}

  async reservarMedicamento() {
    console.log("Reservando medicamento...");
    console.log("Nombre del medicamento:", this.nmedicamento);
    console.log("Entidad:", this.entidad);
    console.log("Dirección:", this.direccionSeleccionada);
    console.log("Fecha de reserva:", this.fechaReserva);
    console.log("Hora de reserva:", this.horaReserva);
    console.log("Cantidad",this.cantidad);

    const mensajeAnterior = this.mensajeDisponibilidad;
    this.mensajeDisponibilidad = '';

    try {
      await this.dataService.crearReservaMedicamento(
        this.nombreCliente,
        this.identificacion,
        this.nmedicamento,
        this.cantidad,
        this.entidad,
        this.direccionSeleccionada,
        this.fechaReserva,
        this.horaReserva
      );

      this.mensajeDisponibilidad = "Medicamento reservado con éxito";
      
    } catch (error) {
      console.error('Error al reservar el medicamento:', error);
      this.mensajeDisponibilidad = "Ocurrió un error al reservar el medicamento";
    }
  }
}
