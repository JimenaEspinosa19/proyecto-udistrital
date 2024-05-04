import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doblefactor',
  templateUrl: './doblefactor.component.html',
  styleUrls: ['./doblefactor.component.css']
})
export class DoblefactorComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { } 

  userEmail: string | null = '';
  verificationCode: string = ''; 
  userEnteredCode: string = ''; 
  isCodeCorrect: boolean = true; 

  ngOnInit(): void {
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
  }

  async Enviar() {
    
    this.verificationCode = this.generateVerificationCode();

    const asunto = 'Codigo de verificación para ingreso a DispenAPP';
    const cuerpo = `El código de verificación de tu cuenta es: ${this.verificationCode}`;
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

  generateVerificationCode(): string {
   
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  verificarCodigo() {
    if (this.userEnteredCode === this.verificationCode) {
      
      this.isCodeCorrect = true;
      this.router.navigate(['/dashboard']);
      console.log('Código correcto. Redirigiendo al dashboard...');
    } else {
      
      this.isCodeCorrect = false;
      console.log('Código incorrecto. Por favor, intenta de nuevo.');
    }
  }
}
