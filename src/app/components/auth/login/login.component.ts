import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title class="text-center">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter your password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="flex justify-between items-center mb-3">
              <mat-checkbox formControlName="rememberMe">Remember Me</mat-checkbox>
              <a href="#" class="forgot-password">Forgot Password?</a>
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width" [disabled]="loginForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>

          <div class="demo-credentials mt-3">
            <h4>Demo Credentials:</h4>
            <p><strong>Admin:</strong> admin&#64;test.com / admin123</p>
            <p><strong>User:</strong> user&#64;test.com / user123</p>
          </div>
        </mat-card-content>

        <mat-card-actions class="text-center">
          <p>Don't have an account? <a routerLink="/signup">Sign up here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password {
      color: #2196F3;
      text-decoration: none;
      font-size: 14px;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
    }

    .demo-credentials h4 {
      margin: 0 0 10px 0;
      color: #2196F3;
    }

    .demo-credentials p {
      margin: 5px 0;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message || 'Login failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}