import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  
  nombreCliente: string = '';
  identificacion: string = '';
  cantidad: string = '';
  nmedicamento: string = '';
  entidad: string = '';
  direccionSeleccionada: string = '';
  fechaReserva: string = '';
  horaReserva: string = '';
  mensajeDisponibilidad: string = '';
  userID: string | null = null;
  horarioDisponible: string[] = [];
  userEmail: string | null = '';

  constructor(private dataService: DataService, private authService: AuthService, private http: HttpClient,private router: Router) { }

  async ngOnInit(): Promise<void> {

    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
    try {
      this.userID = await this.authService.getCurrentUserID();
      console.log("ID de usuario:", this.userID);

      const datosCliente = this.dataService.getDatosCliente();
      console.log("Datos recuperados en ngOnInit del componente de reservas:", datosCliente);
      if (datosCliente) {
        this.nmedicamento = datosCliente.nmedicamento; 
        this.entidad = datosCliente.entidad;
        this.cantidad = datosCliente.cantidad;
        this.direccionSeleccionada = datosCliente.direccionSeleccionada;
      }

      this.generarHorarioDisponible();
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  }

  generarHorarioDisponible() {
    const horario: string[] = [];
    const inicio = new Date();
    inicio.setHours(9, 0, 0); // 9 AM
    const fin = new Date();
    fin.setHours(16, 0, 0); // 4 PM

    while (inicio < fin) {
      horario.push(inicio.toTimeString().substring(0, 5));
      inicio.setMinutes(inicio.getMinutes() + 10); // Incrementa en intervalos de 10 minutos
    }

    this.horarioDisponible = horario;
  }

  validarFecha(event: any) {
    const fechaSeleccionada = new Date(event.target.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establece la hora actual a las 00:00:00 para comparar solo la fecha

    if (fechaSeleccionada < fechaActual || fechaSeleccionada.getDay() === 0 || fechaSeleccionada.getDay() === 6) {
      alert('No se puede seleccionar una fecha anterior a la actual o un fin de semana.');
      this.fechaReserva = '';
    }
  }


async reservarMedicamento() {
  console.log("Reservando medicamento...");
  console.log("Nombre del medicamento:", this.nmedicamento);
  console.log("Entidad:", this.entidad);
  console.log("Dirección:", this.direccionSeleccionada);
  console.log("Fecha de reserva:", this.fechaReserva);
  console.log("Hora de reserva:", this.horaReserva);
  console.log("Cantidad:", this.cantidad);

  const mensajeAnterior = this.mensajeDisponibilidad;
  this.mensajeDisponibilidad = '';

 
  if (!this.nombreCliente || !this.identificacion || !this.nmedicamento || !this.cantidad || !this.entidad || !this.direccionSeleccionada || !this.fechaReserva || !this.horaReserva) {
    this.mensajeDisponibilidad = "Por favor, completa todos los campos antes de realizar la reserva.";
    return;
  }

  if (this.userID !== null) {
    try {
     
      const reservaExistente = await this.dataService.obtenerReservaExistente(this.fechaReserva, this.horaReserva);
      
      if (reservaExistente) {
        this.mensajeDisponibilidad = "Ya hay una reserva existente para esta fecha y hora. Por favor, elige otra hora.";
        return;
      }

      await this.dataService.crearReservaMedicamento(
        this.nombreCliente,
        this.identificacion,
        this.nmedicamento,
        this.cantidad,
        this.entidad,
        this.direccionSeleccionada,
        this.fechaReserva,
        this.horaReserva,
        this.userID
      );

      this.mensajeDisponibilidad = "Medicamento reservado con éxito";
      await this.Modificar();
    } catch (error) {
      console.error('Error al reservar el medicamento:', error);
      this.mensajeDisponibilidad = "Ocurrió un error al reservar el medicamento";
    }
  } else {
    console.error('El ID del usuario es nulo. No se puede reservar el medicamento.');
    this.mensajeDisponibilidad = "No se puede reservar el medicamento porque el ID del usuario es nulo.";
  }
}
async EnviarCorreo(){
  const asunto= 'Medicamento en DispenAPP quedó reservado'
  const cuerpo = `Estimado/a Usuario/a \n\n Se informa que tu medicamento ${this.nmedicamento} quedó reservado exitosamente. A continuación los datos de tu reserva \n'
  'Nombre del medicamento: ${this.nmedicamento} \n Cantidad: ${this.cantidad} \n Entidad: ${this.entidad} \n Dirección ${this.direccionSeleccionada}\n Fecha Reserva: ${this.fechaReserva}\n Hora reserva: ${this.horaReserva}\n`

  
  const correodata = {
  to: this.userEmail,
  subject: asunto,
  message: cuerpo

  };
  this.http.post<any>('https://us-central1-proyecto-final-8e4e0.cloudfunctions.net/mailer',correodata)
  .subscribe(
    response=>{
      console.log('correo enviado',response);
    },
    error=>{
      console.log('error al enviar correo',error);
    },
    

  );


}
volverAMedicamentos() {
  this.router.navigate(['/medicamentos']);
}

async Modificar() {
 
  await this.dataService.modificarCantidadMedicamentoReserva(
    this.nmedicamento,
    this.entidad,
    this.direccionSeleccionada,
    parseInt(this.cantidad, 10) 
    
  );
  this.mensajeDisponibilidad = 'El medicamento fue modificado correctamente';
}


}