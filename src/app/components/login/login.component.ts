import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLoginPage: boolean = true;
  constructor(private authService: AuthService,private http: HttpClient) {

  }

  userEmail: string | null = '';
  verificationCode: string = ''; 
  userEnteredCode: string = ''; 

  ngOnInit(): void {
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
    });
  }


  logIn(email: string, password: string) {
    this.authService.logInWithEmailAndPassword(email, password);
  }

  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }

  async Enviar(){
  
    this.verificationCode = this.generateVerificationCode();

    

    const asunto = 'Tu medicamento ya está disponible';
    const cuerpo = `Estimado/a Usuario/a \n\n El código de verificación de tu cuenta es: ${this.verificationCode}`;
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

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }

}
