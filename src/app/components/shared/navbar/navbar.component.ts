import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService, User } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="isHandset ? 'dialog' : 'navigation'"
        [mode]="isHandset ? 'over' : 'side'"
        [opened]="!isHandset">
        <mat-toolbar>
          <span class="logo">InterviewPrep</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="nav-active">
            <mat-icon>dashboard</mat-icon>
            <span class="ml-2">Dashboard</span>
          </a>
          <a mat-list-item routerLink="/practice" routerLinkActive="nav-active">
            <mat-icon>quiz</mat-icon>
            <span class="ml-2">Practice</span>
          </a>
          <a mat-list-item routerLink="/notes" routerLinkActive="nav-active">
            <mat-icon>note</mat-icon>
            <span class="ml-2">Notes</span>
          </a>
          <a mat-list-item routerLink="/progress" routerLinkActive="nav-active">
            <mat-icon>trending_up</mat-icon>
            <span class="ml-2">Progress</span>
          </a>
          <a mat-list-item routerLink="/admin" routerLinkActive="nav-active" *ngIf="currentUser?.role === 'admin'">
            <mat-icon>admin_panel_settings</mat-icon>
            <span class="ml-2">Admin</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="main-toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="spacer"></span>
          
          <div class="user-menu" *ngIf="currentUser">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
              <span class="mobile-hidden ml-2">{{ currentUser.name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>email</mat-icon>
                <span>{{ currentUser.email }}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>
        
        <div class="main-content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
      background: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .sidenav .mat-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .logo {
      font-size: 18px;
      font-weight: 600;
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-button {
      color: white;
    }

    .main-content {
      padding: 20px;
      min-height: calc(100vh - 64px);
      background-color: #f5f7fa;
    }

    .nav-active {
      background-color: rgba(33, 150, 243, 0.1) !important;
      color: #2196F3 !important;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 10px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;
  currentUser: User | null = null;
  isHandset = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    this.subscription.add(
      this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
        this.isHandset = result.matches;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}