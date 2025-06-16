import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title class="text-center">
            <h1>Create Account</h1>
            <p>Join InterviewPrep today</p>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput type="text" formControlName="name" placeholder="Enter your full name">
              <mat-error *ngIf="signupForm.get('name')?.hasError('required')">
                Full name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter your password">
              <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="signupForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your password">
              <mat-error *ngIf="signupForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="signupForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    class="full-width" [disabled]="signupForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Create Account</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="text-center">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message || 'Signup failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}