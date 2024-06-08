import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-proximosa-vencer',
  templateUrl: './proximosa-vencer.component.html',
  styleUrls: ['./proximosa-vencer.component.css']
})
export class ProximosaVencerComponent implements OnInit {

  medicamentosFiltrados!: Observable<any[]>;
  medicamentoControl = new FormControl();
  Nombre: string = '';
  cantidad: number =0;
  fechaVencimiento: string= '';
  mensaje: string ='';
  opcionesMedicamentos: any[] = []; 
  nmedicamento: any;
  telefono: string='';
  userEmail: string | null = '';


  constructor(private dataService: DataService, private router: Router, private authService: AuthService) { }


  async ngOnInit() {
       
    
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });

      this.medicamentosFiltrados = this.medicamentoControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterMedicamentos(value))
      );
  
  
      this.opcionesMedicamentos = await this.dataService.getMedicamentos(); 
    }

  private filterMedicamentos(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue || !this.opcionesMedicamentos) {      
      return [];
    }
    return this.opcionesMedicamentos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }

  selectMedicamento(medicamento: any) {
    this.Nombre = medicamento.Nombre; 
    this.medicamentoControl.setValue(medicamento.Nombre); 
  }

  async addMedicament(Nombre: string, cantidad: number, fechaVencimiento: string, telefono: string) {
    if (!Nombre || !cantidad || !fechaVencimiento || !telefono) {
      this.mensaje = "Por favor completa todos los campos.";
      return;
    }

    try {
      await this.dataService.agregarMedicamento(Nombre, cantidad, fechaVencimiento, telefono);
      this.mensaje = "Medicamento registrado correctamente.";
    } catch (error) {
      console.error("Error al registrar el medicamento:", error);
      this.mensaje = "Ocurrió un error al registrar el medicamento.";
    }
  }

   async verMedicamentos(){

    this.router.navigate(['/proximosvencer']);
   }
}