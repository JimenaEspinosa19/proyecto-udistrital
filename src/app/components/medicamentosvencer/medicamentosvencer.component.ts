import { Component, OnInit, HostListener } from '@angular/core';
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
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  userEmail: string | null = '';

  constructor(private dataService: DataService, private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
    this.updateItemsPerPage();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateItemsPerPage();
  }

  async cargarMedicamentos() {
    try {
      this.medicamentos = await this.dataService.getEntregarapida();
      this.medicamentosFiltrados = [...this.medicamentos];
      this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
      console.log(this.medicamentos); 
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    }
  }

  EliminarMedicamento(reservaData: any) {
    if (reservaData) {
      this.dataService.eliminarMedicamentoVencer(reservaData).then(() => {
        console.log('Medicamento eliminado correctamente');
        this.cargarMedicamentos();
      }).catch((error: any) => {
        console.error('Error al eliminar el medicamento:', error);
      });
    } else {
      console.error('Los datos del medicamento son undefined');
    }
  }

  async EnviarCorreo(medicamento: any) {
    const asunto = 'Medicamento próximo a vencer en DispenAPP quedó reservado';
    const cuerpo = `Estimado/a usuario/a \n\n Se informa que tu medicamento ${medicamento.nombre} quedó reservado exitosamente.\n
                    Nombre del medicamento: ${medicamento.nombre}\n
                    Cantidad: ${medicamento.cantidad}\n
                    Fecha de vencimiento: ${medicamento.fechaVencimiento}\n
                    Teléfono: ${medicamento.telefono}\n
                    Recuerde contactarse al número de teléfono indicado para solicitar su entrega`;

    const correodata = {
      to: this.userEmail,
      subject: asunto,
      message: cuerpo
    };

    this.http.post<any>('https://us-central1-proyecto-final-8e4e0.cloudfunctions.net/mailer', correodata)
      .subscribe(
        response => {
          console.log('Correo enviado', response);
        },
        error => {
          console.log('Error al enviar correo', error);
        }
      );
  }

  volverAMedicamentos() {
    this.router.navigate(['/vencimiento']);
  }

  updateItemsPerPage() {
    if (window.innerWidth <= 600) {
      this.itemsPerPage = 1; 
    } else {
      this.itemsPerPage = 10; 
    }
    this.totalPages = Math.ceil(this.medicamentosFiltrados.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}