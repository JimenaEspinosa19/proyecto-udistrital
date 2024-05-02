import { Component, OnInit } from '@angular/core';
declare const gapi: any;


@Component({
  selector: 'app-doblefactor',
  templateUrl: './doblefactor.component.html',
  styleUrls: ['./doblefactor.component.css']
})
export class DoblefactorComponent implements OnInit {

  ngOnInit() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: '795814791107-mufjpht6dbquk1qr1ko5p53ghkelsptf.apps.googleusercontent.com', 
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: 'https://www.googleapis.com/auth/gmail.send'
      }).then(() => {
        
      });
    });
  }

  sendEmail() {
    const headers = {
      'To': 'dornige.jimena@gmail.com',
      'Subject': 'Hola',
    };
    const message = [
      'Content-Type: text/plain; charset="UTF-8"\r\n',
      'MIME-Version: 1.0\r\n',
      'Content-Transfer-Encoding: 7bit\r\n',
      'to: dornige.jimena@gmail.com\r\n',
      'subject: Asunto del correo\r\n\r\n',

      'Contenido del correo aquí.'
    ].join('');

    const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');
    const request = gapi.client.gmail.users.messages.send({
      'userId': 'me',
      'resource': {
        'raw': encodedMessage
      }
    });

    request.execute((response: any) => {
      console.log(response);
    });
  }
}