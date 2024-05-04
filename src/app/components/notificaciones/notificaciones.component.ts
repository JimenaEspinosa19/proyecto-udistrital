import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


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
  ciudad: string = '';


  constructor(private dataService: DataService, private authService: AuthService, private http: HttpClient, private router: Router) { } 

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
        this.ciudad = datosCliente.ciudad
        
      }
    }
  
  async Notificacion() {
    try {
      await this.dataService.crearNotificacion({
        nombreCliente: this.nombreCliente,
        identificacion: this.identificacion,
        nmedicamento: this.nmedicamento,
        cantidad: this.cantidad,
        ciudad: this.ciudad,
        entidad: this.entidad,
        direccionSeleccionada: this.direccionSeleccionada,
        
      });
      console.log('Datos de notificación guardados correctamente en Firebase.');
      console.log(this.userEmail);
      this.mensajeDisponibilidad = 'Notificación enviada correctamente.';
    } catch (error) {
      console.error('Error al guardar datos de notificación en Firebase:', error);
      this.mensajeDisponibilidad = 'Error al enviar la notificación.';
    }
  }

    async Enviar(){
      const asunto= 'Tu medicamento ya está disponible'
      const cuerpo = `Message: ${asunto} ${this.nmedicamento} ${this.cantidad} ${this.entidad} ${this.direccionSeleccionada}`
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

  
}
