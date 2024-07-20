import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    if (this.username && this.password) {
      console.log('Login successful');
      // Aquí puedes agregar la lógica para autenticar al usuario
    } else {
      console.log('Login failed');
    }
  }
}