import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modificarinventario',
  templateUrl: './modificarinventario.component.html',
  styleUrls: ['./modificarinventario.component.css']
})
export class ModificarinventarioComponent {
nombreCliente: string = '';
identificacion: string = '';
cantidad: string ='';
nmedicamento: string = '';
entidad: string = '';
direccionSeleccionada: string = '';
mensajeDisponibilidad: string = '';
userEmail: string | null = '';
ciudad: string ='';
direcciones: string[] = [];



constructor(private dataService: DataService, private authService: AuthService, private router: Router) { } 

ngOnInit(): void {
 
    const datosCliente = this.dataService.getDatosCliente();
    console.log("Datos recuperados en ngOnInit del componente de registrar:", datosCliente);
    if (datosCliente) {
      this.nmedicamento = datosCliente.nmedicamento; 
      this.ciudad = datosCliente.ciudad;
      this.entidad = datosCliente.entidad;
      this.direccionSeleccionada = datosCliente.direccionSeleccionada;
      this.cantidad = datosCliente.cantidad;
      
    }
  }

  async Modificar() {
 
    await this.dataService.modificarCantidadMedicamento(
      this.nmedicamento,
      this.ciudad,
      this.entidad,
      this.direcciones,
      parseInt(this.cantidad, 10) 
      
    );
    this.mensajeDisponibilidad = 'El medicamento fue modificado correctamente';
  }
}
