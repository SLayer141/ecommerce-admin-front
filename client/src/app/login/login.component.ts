import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/auth-form.styles.css']  
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const userData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/login', userData).subscribe(
  (res: any) => {
    alert('Login successful!');
    this.router.navigate(['/product-table']);
  },
  (err) => {
    this.errorMessage = err.error.message || 'Login failed';
  }
);
  }}
