import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {

  nombre: string = '';
  cantidad: string = '';
  entidad: string = '';
  mensaje: string = '';
  direcciones: string[] = [];
  direccionSeleccionada: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dataService: DataService
  ) {}

  async addMedicament(nombre: string, cantidad: string, entidad: string) {
    if (!this.nombre || !this.cantidad || !this.direccionSeleccionada || !this.entidad) {
      this.mensaje = "Por favor, complete todos los campos.";
      return;
    }
  
    const medicamentos = await this.dataService.getMedicamentos();
    const direccionesString = this.direccionSeleccionada; 
  
    const medicamentoExistente = medicamentos.find(medicamento =>
      medicamento['nombre'] === nombre &&
      medicamento['direcciones'].includes(direccionesString) && 
      medicamento['entidad'] === entidad
    );
  
    if (medicamentoExistente) {
      this.mensaje = "¡El medicamento ya existe en la base de datos!";
      return;
    }
  
    await this.dataService.createmedicament(nombre, cantidad, [direccionesString], entidad); 
    this.mensaje = "Medicamento ingresado correctamente.";
  }
  
  async actualizarDireccionesPorEntidad(entidad: string) {
  const direcciones = await this.dataService.getDireccionesPorEntidad(entidad);
  if (direcciones && direcciones.length > 0) {
    this.direcciones = direcciones;
  } else {
    this.direcciones = [];
  }
}
}
