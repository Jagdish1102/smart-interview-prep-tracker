import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { QuestionService, Question } from '../../services/question.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    NavbarComponent
  ],
  template: `
    <app-navbar>
      <div class="container">
        <div class="header-section">
          <h1>Admin Panel</h1>
          <p>Manage questions, categories, and monitor user statistics</p>
        </div>

        <mat-tab-group class="admin-tabs">
          <mat-tab label="Add Question">
            <div class="tab-content">
              <mat-card class="form-card">
                <mat-card-header>
                  <mat-card-title>Add New Question</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="questionForm" (ngSubmit)="addQuestion()">
                    <div class="form-row">
                      <mat-form-field class="full-width">
                        <mat-label>Question Title</mat-label>
                        <input matInput formControlName="title" placeholder="Enter question title">
                        <mat-error *ngIf="questionForm.get('title')?.hasError('required')">
                          Title is required
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field class="full-width">
                        <mat-label>Description</mat-label>
                        <textarea matInput rows="4" formControlName="description" 
                                 placeholder="Enter detailed question description"></textarea>
                        <mat-error *ngIf="questionForm.get('description')?.hasError('required')">
                          Description is required
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field>
                        <mat-label>Category</mat-label>
                        <mat-select formControlName="category">
                          <mat-option value="Java">Java</mat-option>
                          <mat-option value="DSA">Data Structures & Algorithms</mat-option>
                          <mat-option value="DBMS">Database Management</mat-option>
                          <mat-option value="HR">Human Resources</mat-option>
                        </mat-select>
                        <mat-error *ngIf="questionForm.get('category')?.hasError('required')">
                          Category is required
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label>Difficulty</mat-label>
                        <mat-select formControlName="difficulty">
                          <mat-option value="Easy">Easy</mat-option>
                          <mat-option value="Medium">Medium</mat-option>
                          <mat-option value="Hard">Hard</mat-option>
                        </mat-select>
                        <mat-error *ngIf="questionForm.get('difficulty')?.hasError('required')">
                          Difficulty is required
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field class="full-width">
                        <mat-label>Tags (comma-separated)</mat-label>
                        <input matInput formControlName="tags" placeholder="e.g., OOP, Fundamentals">
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field class="full-width">
                        <mat-label>Hint (optional)</mat-label>
                        <textarea matInput rows="2" formControlName="hint" 
                                 placeholder="Provide a helpful hint for the question"></textarea>
                      </mat-form-field>
                    </div>

                    <div class="form-actions">
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="questionForm.invalid">
                        <mat-icon>add</mat-icon>
                        Add Question
                      </button>
                      <button mat-button type="button" (click)="resetForm()">
                        <mat-icon>refresh</mat-icon>
                        Reset Form
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Manage Questions">
            <div class="tab-content">
              <mat-card class="questions-card">
                <mat-card-header>
                  <mat-card-title>All Questions ({{ questions.length }})</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="questions-table">
                    <div class="question-item" *ngFor="let question of questions">
                      <div class="question-info">
                        <h4>{{ question.title }}</h4>
                        <p>{{ question.description }}</p>
                        <div class="question-meta">
                          <span class="category-badge" [style.backgroundColor]="getCategoryColor(question.category)">
                            {{ question.category }}
                          </span>
                          <span class="difficulty-badge" [ngClass]="'difficulty-' + question.difficulty.toLowerCase()">
                            {{ question.difficulty }}
                          </span>
                          <span class="status-badge" [ngClass]="'status-' + question.status">
                            {{ formatStatus(question.status) }}
                          </span>
                        </div>
                        <div class="tags" *ngIf="question.tags.length > 0">
                          <mat-chip-listbox>
                            <mat-chip *ngFor="let tag of question.tags">{{ tag }}</mat-chip>
                          </mat-chip-listbox>
                        </div>
                      </div>
                      <div class="question-actions">
                        <button mat-icon-button color="warn" (click)="deleteQuestion(question.id)" 
                                matTooltip="Delete Question">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Statistics">
            <div class="tab-content">
              <div class="stats-overview">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">quiz</mat-icon>
                      <div>
                        <h3>{{ questions.length }}</h3>
                        <p>Total Questions</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">category</mat-icon>
                      <div>
                        <h3>{{ getUniqueCategories().length }}</h3>
                        <p>Categories</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">check_circle</mat-icon>
                      <div>
                        <h3>{{ getCompletedQuestions() }}</h3>
                        <p>Completed Questions</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">trending_up</mat-icon>
                      <div>
                        <h3>{{ getCompletionRate() }}%</h3>
                        <p>Completion Rate</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <mat-card class="category-stats">
                <mat-card-header>
                  <mat-card-title>Category Breakdown</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="category-list">
                    <div class="category-stat" *ngFor="let category of getCategoryStats()">
                      <div class="category-info">
                        <div class="category-icon" [style.backgroundColor]="category.color">
                          <mat-icon>{{ category.icon }}</mat-icon>
                        </div>
                        <div>
                          <h4>{{ category.name }}</h4>
                          <p>{{ category.total }} questions</p>
                        </div>
                      </div>
                      <div class="category-metrics">
                        <span class="completion-count">{{ category.completed }}/{{ category.total }}</span>
                        <div class="progress-bar-container">
                          <div class="progress-bar" 
                               [style.width.%]="getProgressPercentage(category.completed, category.total)">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Broadcast Message">
            <div class="tab-content">
              <mat-card class="broadcast-card">
                <mat-card-header>
                  <mat-card-title>Send Motivational Message</mat-card-title>
                  <mat-card-subtitle>Send encouraging messages to all users</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="broadcastForm" (ngSubmit)="sendBroadcast()">
                    <mat-form-field class="full-width">
                      <mat-label>Message Title</mat-label>
                      <input matInput formControlName="title" placeholder="Enter message title">
                    </mat-form-field>

                    <mat-form-field class="full-width">
                      <mat-label>Message Content</mat-label>
                      <textarea matInput rows="4" formControlName="content" 
                               placeholder="Write your motivational message..."></textarea>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="broadcastForm.invalid">
                        <mat-icon>send</mat-icon>
                        Send Message
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
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

    .admin-tabs {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .form-card,
    .questions-card,
    .broadcast-card {
      border-radius: 12px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 20px;
    }

    .questions-table {
      max-height: 600px;
      overflow-y: auto;
    }

    .question-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }

    .question-item:last-child {
      border-bottom: none;
    }

    .question-info {
      flex: 1;
    }

    .question-info h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .question-info p {
      margin: 0 0 12px 0;
      color: #666;
      line-height: 1.5;
    }

    .question-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .category-badge {
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .difficulty-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }

    .difficulty-easy { background: #4CAF50; }
    .difficulty-medium { background: #FF9800; }
    .difficulty-hard { background: #f44336; }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }

    .status-not-started { background: #9e9e9e; }
    .status-in-progress { background: #ff9800; }
    .status-completed { background: #4caf50; }

    .tags {
      margin-top: 8px;
    }

    .question-actions {
      flex-shrink: 0;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      border-radius: 12px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #2196F3;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
    }

    .category-stats {
      border-radius: 12px;
    }

    .category-list {
      display: grid;
      gap: 16px;
    }

    .category-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .category-icon {
      border-radius: 50%;
      padding: 8px;
      color: white;
    }

    .category-info h4 {
      margin: 0;
      color: #333;
    }

    .category-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .category-metrics {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .completion-count {
      font-weight: 600;
      color: #2196F3;
    }

    .progress-bar-container {
      width: 100px;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: #2196F3;
      transition: width 0.3s ease;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      
      .stats-overview {
        grid-template-columns: 1fr;
      }
      
      .category-stat {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
    }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  questionForm: FormGroup;
  broadcastForm: FormGroup;
  questions: Question[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      tags: [''],
      hint: ['']
    });

    this.broadcastForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addQuestion() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const tags = formValue.tags 
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      this.questionService.addQuestion({
        ...formValue,
        tags
      });

      this.snackBar.open('Question added successfully!', 'Close', { duration: 3000 });
      this.resetForm();
    }
  }

  resetForm() {
    this.questionForm.reset();
  }

  deleteQuestion(questionId: string) {
    this.questionService.deleteQuestion(questionId);
    this.snackBar.open('Question deleted successfully!', 'Close', { duration: 3000 });
  }

  sendBroadcast() {
    if (this.broadcastForm.valid) {
      // In a real app, this would send the message to all users
      this.snackBar.open('Broadcast message sent to all users!', 'Close', { duration: 3000 });
      this.broadcastForm.reset();
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Java': '#f44336',
      'DSA': '#4caf50',
      'DBMS': '#2196f3',
      'HR': '#ff9800'
    };
    return colors[category] || '#9e9e9e';
  }

  formatStatus(status: string): string {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getUniqueCategories(): string[] {
    const categories = new Set(this.questions.map(q => q.category));
    return Array.from(categories);
  }

  getCompletedQuestions(): number {
    return this.questions.filter(q => q.status === 'completed').length;
  }

  getCompletionRate(): number {
    const total = this.questions.length;
    const completed = this.getCompletedQuestions();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getCategoryStats() {
    return this.questionService.getCategories();
  }

  getProgressPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}