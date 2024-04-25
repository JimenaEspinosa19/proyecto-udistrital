import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-misreservas',
  templateUrl: './misreservas.component.html',
  styleUrls: ['./misreservas.component.css']
})
export class MisreservasComponent implements OnInit {
  reservas: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    this.dataService.getReservas().then(reservas => {
      this.reservas = reservas;

      console.log(this.reservas)
    }).catch(error => {
      console.error('Error al cargar reservas:', error);
    });
  }
}

