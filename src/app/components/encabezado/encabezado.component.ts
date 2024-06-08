import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encabezado',

  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent {
sidenav: any;

  constructor(private authService: AuthService, private router: Router) {}


  logOut() {
    this.authService.logOut();
  }

}
