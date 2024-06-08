import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicamentosvencer',
  templateUrl: './medicamentosvencer.component.html',
  styleUrls: ['./medicamentosvencer.component.css']
})

export class MedicamentosvencerComponent implements OnInit {
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  medicamentosF: any[] =[];
  terminoBusqueda: string = '';
  userEmail: string | null = '';

  constructor(private dataService: DataService, private http: HttpClient,  private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getEntregarapida();
      this.medicamentosFiltrados = [...this.medicamentos];
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

  async TraerMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getMedicamentos();
      this.medicamentosF = [...this.medicamentos];
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

    EliminarMedicamento(reservaData: any) {
      if (reservaData) {
        this.dataService.eliminarMedicamentoVencer(reservaData).then(() => {
          console.log('Medicamento eliminado correctamente');
        }).catch((error: any) => {
          console.error('Error al eliminar el medicamento:', error);
        });
      } else {
        console.error('Los datos del medicamento son undefined');
      }
    }

    async EnviarCorreo(medicamento: any) {
      const asunto = 'Medicamento proximo a vecner en DispenAPP quedó reservado';
      const cuerpo = `Se informa que tu medicamento ${medicamento.nombre} quedó reservado exitosamente.\n
                      Nombre del medicamento: ${medicamento.nombre}\n
                      Cantidad: ${medicamento.cantidad}\n
                      Fecha de vencimiento: ${medicamento.fechaVencimiento}\n
                      Teléfono: ${medicamento.telefono}\n
                      Recuerde contactarse al número de telefono indicado para solicitar su entrega`;
                      
    
      const correodata = {
        to: this.userEmail,
        subject: asunto,
        message: cuerpo
      };
    
      this.http.post<any>('https://us-central1-proyecto-final-8e4e0.cloudfunctions.net/mailer', correodata)
        .subscribe(
          response => {
            console.log('correo enviado', response);
          },
          error => {
            console.log('error al enviar correo', error);
          }
        );
    }

    volverAMedicamentos() {
      this.router.navigate(['/vencimiento']);
    }
  
}