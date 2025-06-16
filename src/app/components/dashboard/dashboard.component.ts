import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService, User } from '../../services/auth.service';
import { QuestionService, Category } from '../../services/question.service';
import { ProgressService } from '../../services/progress.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterModule,
    NavbarComponent
  ],
  template: `
    <app-navbar>
      <div class="container">
        <div class="welcome-section mb-3">
          <h1>Welcome back, {{ currentUser?.name }}!</h1>
          <p>Ready to ace your next interview? Let's continue your preparation journey.</p>
        </div>

        <div class="stats-grid mb-3">
          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <mat-icon>quiz</mat-icon>
              </div>
              <div class="stats-info">
                <h3>{{ totalCompleted }}</h3>
                <p>Questions Completed</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <mat-icon>local_fire_department</mat-icon>
              </div>
              <div class="stats-info">
                <h3>{{ currentStreak }}</h3>
                <p>Day Streak</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stats-info">
                <h3>{{ totalTimeSpent }}h</h3>
                <p>Time Spent</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stats-info">
                <h3>{{ completionRate }}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div class="categories-section">
          <h2>Practice by Category</h2>
          <div class="categories-grid">
            <mat-card class="category-card" *ngFor="let category of categories">
              <mat-card-content>
                <div class="category-header">
                  <div class="category-icon" [style.background-color]="category.color">
                    <mat-icon>{{ category.icon }}</mat-icon>
                  </div>
                  <div class="category-info">
                    <h3>{{ category.name }}</h3>
                    <p>{{ category.completed }}/{{ category.total }} completed</p>
                  </div>
                </div>
                
                <div class="progress-section">
                  <mat-progress-bar 
                    mode="determinate" 
                    [value]="getProgressPercentage(category.completed, category.total)">
                  </mat-progress-bar>
                  <span class="progress-text">
                    {{ getProgressPercentage(category.completed, category.total) }}%
                  </span>
                </div>

                <div class="category-actions">
                  <button mat-raised-button color="primary" 
                          routerLink="/practice" 
                          [queryParams]="{category: category.name}">
                    <mat-icon>play_arrow</mat-icon>
                    Start Practice
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="quick-actions mt-3">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/practice" class="action-button">
              <mat-icon>quiz</mat-icon>
              <span>Practice Questions</span>
            </button>
            <button mat-raised-button color="accent" routerLink="/notes" class="action-button">
              <mat-icon>note</mat-icon>
              <span>Review Notes</span>
            </button>
            <button mat-raised-button routerLink="/progress" class="action-button">
              <mat-icon>analytics</mat-icon>
              <span>View Progress</span>
            </button>
          </div>
        </div>
      </div>
    </app-navbar>
  `,
  styles: [`
    .welcome-section h1 {
      color: #2196F3;
      margin-bottom: 10px;
    }

    .welcome-section p {
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stats-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stats-card:hover {
      transform: translateY(-2px);
    }

    .stats-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stats-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 12px;
    }

    .stats-info h3 {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
    }

    .stats-info p {
      margin: 0;
      opacity: 0.9;
    }

    .categories-section h2,
    .quick-actions h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .category-card {
      border-radius: 12px;
      transition: box-shadow 0.3s ease;
    }

    .category-card:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .category-icon {
      border-radius: 50%;
      padding: 12px;
      color: white;
    }

    .category-info h3 {
      margin: 0;
      color: #333;
    }

    .category-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .progress-section {
      margin-bottom: 16px;
    }

    .progress-text {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
      display: block;
    }

    .category-actions {
      display: flex;
      justify-content: flex-end;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-button {
      height: 60px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  categories: Category[] = [];
  totalCompleted = 0;
  currentStreak = 0;
  totalTimeSpent = 0;
  completionRate = 0;
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private questionService: QuestionService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadDashboardData() {
    this.categories = this.questionService.getCategories();
    this.totalCompleted = this.categories.reduce((sum, cat) => sum + cat.completed, 0);
    const totalQuestions = this.categories.reduce((sum, cat) => sum + cat.total, 0);
    this.completionRate = totalQuestions > 0 ? Math.round((this.totalCompleted / totalQuestions) * 100) : 0;
    
    this.currentStreak = this.progressService.getCurrentStreak();
    this.totalTimeSpent = Math.round(this.progressService.getTotalTimeSpent() / 60); // Convert to hours
  }

  getProgressPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}