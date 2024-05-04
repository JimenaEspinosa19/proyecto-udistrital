import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  userData: any;

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private afAuth: AngularFireAuth


    
  ) {

    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    })

  }

  logInWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuario:", user); 
  
        if (user) {
          if (user.emailVerified) {
         
            this.router.navigate(['doblefactor']);
          } else {
      
            console.log("Usuario autenticado pero no verificado, redireccionando a verificar correo");
            this.router.navigate(['/verificacion']);
          }
        } else {
         
          console.log("Usuario no autenticado o no existente");
          alert("Error de inicio de sesión: Usuario no autenticado o no existente");
        }
       
      })
      .catch((error) => {
        console.error("Error durante el inicio de sesión:", error);
        alert(error.message);
      });
  }
  

  logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithPopup(new GoogleAuthProvider())
      .then(() => 
        this.observeUserState())
      .catch((error: Error) => {
        alert(error.message);
      })
  }

  
  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.VerificarCorreo()
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  VerificarCorreo() {
    this.userData.sendEmailVerification()
      .then(() => {
        console.log('Correo de verificación enviado correctamente');
        alert('Le hemos enviado un correo electrónico para verificar su cuenta');
        this.router.navigate(['/login']);
      })
      .catch((error: any) => {
        console.error('Error al enviar el correo de verificación:', error);
      });
  }
  

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['dashboard']))
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }
  
  getCurrentUserID(): string | null {
    if (this.userData) {
      return this.userData.uid;
    } else {
      return null;
    }
  }
  // logOut
  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

  getUserEmail(): Observable<string | null> {
    return this.afAuth.authState.pipe(map(user => user ? user.email : null));
  }
  

}
