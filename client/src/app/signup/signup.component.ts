import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../styles/auth-form.styles.css']  
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      email: this.email,
      password: this.password
    };

     this.http.post('http://localhost:3000/api/signup', userData).subscribe(
  (res: any) => {
    alert('Signup successful!');
    this.router.navigate(['/dashboard']);
  },
  (err) => {
    this.errorMessage = err.error.message || 'Login failed';
  }
);
  }}