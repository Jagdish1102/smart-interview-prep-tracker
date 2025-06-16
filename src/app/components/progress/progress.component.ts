import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { QuestionService, Category } from '../../services/question.service';
import { ProgressService, ProgressData } from '../../services/progress.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    NavbarComponent
  ],
  template: `
    <app-navbar>
      <div class="container">
        <div class="header-section">
          <h1>Progress Tracker</h1>
          <p>Monitor your interview preparation journey and track your improvements</p>
        </div>

        <mat-tab-group class="progress-tabs">
          <mat-tab label="Overview">
            <div class="tab-content">
              <div class="overview-stats">
                <div class="stats-card completion-card">
                  <div class="stats-icon">
                    <mat-icon>quiz</mat-icon>
                  </div>
                  <div class="stats-content">
                    <h3>{{ overallProgress.completed }}/{{ overallProgress.total }}</h3>
                    <p>Questions Completed</p>
                    <mat-progress-bar mode="determinate" [value]="overallProgress.percentage"></mat-progress-bar>
                    <span class="progress-text">{{ overallProgress.percentage }}% Complete</span>
                  </div>
                </div>

                <div class="stats-card streak-card">
                  <div class="stats-icon">
                    <mat-icon>local_fire_department</mat-icon>
                  </div>
                  <div class="stats-content">
                    <h3>{{ currentStreak }}</h3>
                    <p>Day Streak</p>
                    <p class="streak-message">{{ getStreakMessage() }}</p>
                  </div>
                </div>

                <div class="stats-card time-card">
                  <div class="stats-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="stats-content">
                    <h3>{{ Math.round(totalTimeSpent / 60) }}h {{ totalTimeSpent % 60 }}m</h3>
                    <p>Total Time Spent</p>
                    <p class="time-message">Keep up the great work!</p>
                  </div>
                </div>
              </div>

              <div class="activity-chart">
                <h2>Recent Activity (Last 30 Days)</h2>
                <div class="chart-container">
                  <div class="activity-grid">
                    <div class="activity-day" 
                         *ngFor="let day of progressData" 
                         [class.has-activity]="day.questionsCompleted > 0"
                         [style.--intensity]="getActivityIntensity(day.questionsCompleted)"
                         [title]="formatDayTooltip(day)">
                    </div>
                  </div>
                  <div class="chart-legend">
                    <span>Less</span>
                    <div class="legend-scale">
                      <div class="legend-day" data-level="0"></div>
                      <div class="legend-day" data-level="1"></div>
                      <div class="legend-day" data-level="2"></div>
                      <div class="legend-day" data-level="3"></div>
                      <div class="legend-day" data-level="4"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="By Category">
            <div class="tab-content">
              <div class="categories-progress">
                <mat-card class="category-progress-card" *ngFor="let category of categories">
                  <mat-card-content>
                    <div class="category-header">
                      <div class="category-icon" [style.background-color]="category.color">
                        <mat-icon>{{ category.icon }}</mat-icon>
                      </div>
                      <div class="category-info">
                        <h3>{{ category.name }}</h3>
                        <p>{{ category.completed }}/{{ category.total }} questions completed</p>
                      </div>
                      <div class="category-percentage">
                        <span class="percentage-text">{{ getProgressPercentage(category.completed, category.total) }}%</span>
                      </div>
                    </div>
                    
                    <mat-progress-bar 
                      mode="determinate" 
                      [value]="getProgressPercentage(category.completed, category.total)"
                      class="category-progress-bar">
                    </mat-progress-bar>
                    
                    <div class="category-details">
                      <div class="detail-item">
                        <mat-icon>check_circle</mat-icon>
                        <span>{{ category.completed }} Completed</span>
                      </div>
                      <div class="detail-item">
                        <mat-icon>radio_button_unchecked</mat-icon>
                        <span>{{ category.total - category.completed }} Remaining</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Weekly Summary">
            <div class="tab-content">
              <div class="weekly-summary">
                <h2>Weekly Progress</h2>
                <div class="weekly-chart">
                  <div class="week-bar" *ngFor="let week of weeklyProgress">
                    <div class="bar-container">
                      <div class="bar" [style.height.%]="getWeeklyBarHeight(week.completed)">
                        <span class="bar-value">{{ week.completed }}</span>
                      </div>
                    </div>
                    <span class="week-label">{{ formatWeekLabel(week.week) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-navbar>
  `,
  styles: [`
    .header-section h1 {
      color: #2196F3;
      margin-bottom: 10px;
    }

    .header-section p {
      color: #666;
      font-size: 16px;
    }

    .progress-tabs {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .overview-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stats-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .completion-card {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    }

    .streak-card {
      background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
    }

    .time-card {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    }

    .stats-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 16px;
      flex-shrink: 0;
    }

    .stats-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stats-content h3 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .stats-content p {
      margin: 0;
      opacity: 0.9;
    }

    .progress-text {
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    .streak-message,
    .time-message {
      font-size: 12px;
      margin-top: 4px;
      font-style: italic;
    }

    .activity-chart {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .activity-chart h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: repeat(30, 1fr);
      gap: 3px;
      margin-bottom: 10px;
    }

    .activity-day {
      width: 12px;
      height: 12px;
      background: #eee;
      border-radius: 2px;
    }

    .activity-day.has-activity {
      background: hsl(120, calc(var(--intensity) * 50%), calc(50% + var(--intensity) * 20%));
    }

    .chart-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
    }

    .legend-scale {
      display: flex;
      gap: 2px;
    }

    .legend-day {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background: #eee;
    }

    .legend-day[data-level="1"] { background: #c6e48b; }
    .legend-day[data-level="2"] { background: #7bc96f; }
    .legend-day[data-level="3"] { background: #239a3b; }
    .legend-day[data-level="4"] { background: #196127; }

    .categories-progress {
      display: grid;
      gap: 20px;
    }

    .category-progress-card {
      border-radius: 12px;
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
      flex-shrink: 0;
    }

    .category-info {
      flex: 1;
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

    .percentage-text {
      font-size: 24px;
      font-weight: 600;
      color: #2196F3;
    }

    .category-progress-bar {
      margin-bottom: 16px;
    }

    .category-details {
      display: flex;
      gap: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .weekly-summary {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .weekly-summary h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .weekly-chart {
      display: flex;
      align-items: end;
      gap: 16px;
      height: 200px;
    }

    .week-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .bar-container {
      height: 150px;
      display: flex;
      align-items: end;
      width: 100%;
    }

    .bar {
      background: linear-gradient(to top, #2196F3, #64B5F6);
      width: 100%;
      min-height: 10px;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: end;
      justify-content: center;
      position: relative;
    }

    .bar-value {
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding-bottom: 4px;
    }

    .week-label {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      transform: rotate(-45deg);
    }

    @media (max-width: 768px) {
      .overview-stats {
        grid-template-columns: 1fr;
      }
      
      .activity-grid {
        grid-template-columns: repeat(15, 1fr);
      }
      
      .category-header {
        flex-direction: column;
        text-align: center;
      }
      
      .weekly-chart {
        overflow-x: auto;
      }
    }
  `]
})
export class ProgressComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  progressData: ProgressData[] = [];
  weeklyProgress: { week: string; completed: number }[] = [];
  overallProgress = { completed: 0, total: 0, percentage: 0 };
  currentStreak = 0;
  totalTimeSpent = 0;
  Math = Math;
  private subscription = new Subscription();

  constructor(
    private questionService: QuestionService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.loadProgressData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProgressData() {
    this.categories = this.questionService.getCategories();
    
    // Calculate overall progress
    this.overallProgress.completed = this.categories.reduce((sum, cat) => sum + cat.completed, 0);
    this.overallProgress.total = this.categories.reduce((sum, cat) => sum + cat.total, 0);
    this.overallProgress.percentage = this.overallProgress.total > 0 
      ? Math.round((this.overallProgress.completed / this.overallProgress.total) * 100) 
      : 0;

    this.subscription.add(
      this.progressService.getProgressData().subscribe(data => {
        this.progressData = data;
      })
    );

    this.currentStreak = this.progressService.getCurrentStreak();
    this.totalTimeSpent = this.progressService.getTotalTimeSpent();
    this.weeklyProgress = this.progressService.getWeeklyProgress();
  }

  getProgressPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getActivityIntensity(questionsCompleted: number): number {
    if (questionsCompleted === 0) return 0;
    if (questionsCompleted <= 1) return 1;
    if (questionsCompleted <= 2) return 2;
    if (questionsCompleted <= 3) return 3;
    return 4;
  }

  formatDayTooltip(day: ProgressData): string {
    const date = new Date(day.date);
    const dateStr = date.toLocaleDateString();
    return `${dateStr}: ${day.questionsCompleted} questions, ${day.timeSpent} minutes`;
  }

  getStreakMessage(): string {
    if (this.currentStreak === 0) return "Start your streak today!";
    if (this.currentStreak < 7) return "Great start! Keep it up!";
    if (this.currentStreak < 30) return "Impressive consistency!";
    return "Outstanding dedication!";
  }

  getWeeklyBarHeight(completed: number): number {
    const maxCompleted = Math.max(...this.weeklyProgress.map(w => w.completed), 1);
    return (completed / maxCompleted) * 100;
  }

  formatWeekLabel(weekStart: string): string {
    const date = new Date(weekStart);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}