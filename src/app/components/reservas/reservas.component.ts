import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';





@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  nombre: string = '';
  identificacion: string = '';
  nmedicamento: string = '';
  entidad: string = '';
  direccionSeleccionada: string = '';
  fechaReserva: string = '';
  horaReserva: string = '';
  mensajeDisponibilidad: string = '';

  constructor(private dataService: DataService) { } 

    ngOnInit(): void {
      const datosCliente = this.dataService.getDatosCliente();
      if (datosCliente) {
      
        this.nmedicamento = datosCliente.nmedicamento;
        this.entidad = datosCliente.entidad;
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
  
    
      const mensajeAnterior = this.mensajeDisponibilidad;
  
      
      this.mensajeDisponibilidad = '';
  
   
      await this.dataService.crearReservaMedicamento(
        this.nombre,
        this.identificacion,
        this.nmedicamento,
        this.entidad,
        this.direccionSeleccionada,
        this.fechaReserva,
        this.horaReserva
        
      );
  
      
      this.mensajeDisponibilidad = mensajeAnterior;
  
    
      this.mensajeDisponibilidad = "Medicamento reservado con éxito";
    }
  }
