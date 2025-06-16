import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'practice', 
    loadComponent: () => import('./components/practice/practice.component').then(m => m.PracticeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'notes', 
    loadComponent: () => import('./components/notes/notes.component').then(m => m.NotesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'progress', 
    loadComponent: () => import('./components/progress/progress.component').then(m => m.ProgressComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];