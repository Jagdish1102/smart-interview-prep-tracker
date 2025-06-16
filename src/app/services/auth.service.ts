import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  initializeAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (credentials.email === 'admin@test.com' && credentials.password === 'admin123') {
          const user: User = {
            id: '1',
            name: 'Admin User',
            email: credentials.email,
            role: 'admin'
          };
          this.setAuthData(user, 'fake-jwt-token');
          observer.next({ success: true, user, token: 'fake-jwt-token' });
        } else if (credentials.email === 'user@test.com' && credentials.password === 'user123') {
          const user: User = {
            id: '2',
            name: 'John Doe',
            email: credentials.email,
            role: 'user'
          };
          this.setAuthData(user, 'fake-jwt-token');
          observer.next({ success: true, user, token: 'fake-jwt-token' });
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
        observer.complete();
      }, 1000);
    });
  }

  signup(signupData: SignupData): Observable<any> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (signupData.password !== signupData.confirmPassword) {
          observer.error({ message: 'Passwords do not match' });
          return;
        }
        
        const user: User = {
          id: Date.now().toString(),
          name: signupData.name,
          email: signupData.email,
          role: 'user'
        };
        this.setAuthData(user, 'fake-jwt-token');
        observer.next({ success: true, user, token: 'fake-jwt-token' });
        observer.complete();
      }, 1000);
    });
  }

  private setAuthData(user: User, token: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}