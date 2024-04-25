import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {

 medicamentos: any;
 opcionesMedicamentos: any[] = [];
 nmedicamento: string = '';
 medicamentoControl = new FormControl();
 medicamentosFiltrados!: Observable<any[]>;
 nombreControl = new FormControl();
 direcciones: string[] = [];
 entidad: string = '';
 medicamentoDisponible: boolean = false;
 mensajeDisponibilidad: string = '';
 direccionSeleccionada: string = '';

 constructor(private authService: AuthService, private router: Router, public dataService: DataService) {}

 ngOnInit() {
   this.readMedicamentos(); 
   this.medicamentosFiltrados = this.medicamentoControl.valueChanges.pipe(
     startWith(''),
     map(value => this.filterMedicamentos(value))
   );
 }

 private filterMedicamentos(value: string): any[] {
   const filterValue = value.toLowerCase();
   if (!filterValue) {      
     return [];
   }
   return this.opcionesMedicamentos.filter(option => option.nmedicamento.toLowerCase().includes(filterValue));
 }

 displayFn(med?: any): string | undefined {
   return med ? med.nmedicamento : undefined;
 }

 async readMedicamentos() {
   this.medicamentos = await this.dataService.getMedicamentos();
   this.opcionesMedicamentos = this.medicamentos; 
   console.log('Datos de medicamentos:', this.medicamentos);
 }

 selectMedicamento(medicamento: any) {
   this.nmedicamento = medicamento.nmedicamento; 
   this.medicamentoControl.setValue(medicamento.nmedicamento); 
 }

 async actualizarDireccionesPorEntidad(entidad: string) {
   const direcciones = await this.dataService.getDireccionesPorEntidad(entidad);
   if (direcciones && direcciones.length > 0) {
     this.direcciones = direcciones;
   } else {
     this.direcciones = [];
   }
 }

 async buscarMedicamento() {
 
  this.dataService.setDatosCliente(this.nmedicamento, this.entidad, this.direccionSeleccionada);
  
  const medicamentoEnDireccion = await this.dataService.searchMedicamentoEnDireccion(this.nmedicamento, this.entidad, this.direcciones);
  if (medicamentoEnDireccion) {
    this.medicamentoDisponible = true;
    this.mensajeDisponibilidad = 'El medicamento está disponible en esta dirección.';
  } else {
    this.medicamentoDisponible = false;
    this.mensajeDisponibilidad = 'El medicamento no está disponible en esta dirección.';
  }
 }

async reservarMedicamento() {
  this.router.navigate(['/reservas']);

}

}
