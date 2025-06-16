import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { QuestionService, Question } from '../../services/question.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule,
    NavbarComponent
  ],
  template: `
    <app-navbar>
      <div class="container">
        <div class="header-section">
          <h1>Practice Questions</h1>
          <p>Challenge yourself with interview questions across different categories</p>
        </div>

        <div class="filters-section mb-3">
          <mat-form-field>
            <mat-label>Search Questions</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterQuestions()" 
                   placeholder="Search by title, description, or tags">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="selectedCategory" (ngModelChange)="filterQuestions()">
              <mat-option value="all">All Categories</mat-option>
              <mat-option value="Java">Java</mat-option>
              <mat-option value="DSA">Data Structures & Algorithms</mat-option>
              <mat-option value="DBMS">Database Management</mat-option>
              <mat-option value="HR">Human Resources</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Difficulty</mat-label>
            <mat-select [(ngModel)]="selectedDifficulty" (ngModelChange)="filterQuestions()">
              <mat-option value="all">All Levels</mat-option>
              <mat-option value="Easy">Easy</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="Hard">Hard</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="results-info mb-2">
          <span>Showing {{ filteredQuestions.length }} questions</span>
          <div class="status-filters">
            <mat-chip-listbox [(ngModel)]="statusFilter" (ngModelChange)="filterQuestions()">
              <mat-chip-option value="all">All</mat-chip-option>
              <mat-chip-option value="not-started">Not Started</mat-chip-option>
              <mat-chip-option value="in-progress">In Progress</mat-chip-option>
              <mat-chip-option value="completed">Completed</mat-chip-option>
            </mat-chip-listbox>
          </div>
        </div>

        <div class="questions-list">
          <mat-card class="question-card" 
                    [ngClass]="'difficulty-' + question.difficulty.toLowerCase()" 
                    *ngFor="let question of filteredQuestions">
            <mat-card-header>
              <div class="question-header">
                <div class="question-meta">
                  <span class="category-badge" [style.backgroundColor]="getCategoryColor(question.category)">
                    {{ question.category }}
                  </span>
                  <span class="difficulty-badge" [ngClass]="'difficulty-' + question.difficulty.toLowerCase()">
                    {{ question.difficulty }}
                  </span>
                  <span class="status-badge" [ngClass]="'status-' + question.status">
                    <mat-icon>{{ getStatusIcon(question.status) }}</mat-icon>
                    {{ formatStatus(question.status) }}
                  </span>
                </div>
              </div>
            </mat-card-header>

            <mat-card-content>
              <h3>{{ question.title }}</h3>
              <p class="question-description">{{ question.description }}</p>
              
              <div class="tags-section" *ngIf="question.tags.length > 0">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let tag of question.tags">{{ tag }}</mat-chip>
                </mat-chip-listbox>
              </div>

              <mat-expansion-panel class="notes-panel" *ngIf="question.hint">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>lightbulb</mat-icon>
                    Hint
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <p>{{ question.hint }}</p>
              </mat-expansion-panel>

              <mat-expansion-panel class="notes-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>note</mat-icon>
                    Personal Notes
                    <mat-icon *ngIf="question.notes" matBadge="•" matBadgeColor="accent">note</mat-icon>
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <mat-form-field class="full-width">
                  <mat-label>Add your notes</mat-label>
                  <textarea matInput rows="4" 
                           [ngModel]="question.notes" 
                           (ngModelChange)="updateNotes(question.id, $event)"
                           placeholder="Write your thoughts, solution approach, or key points..."></textarea>
                </mat-form-field>
              </mat-expansion-panel>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button 
                      [color]="question.status === 'in-progress' ? 'accent' : 'primary'"
                      (click)="updateStatus(question.id, 'in-progress')">
                <mat-icon>play_arrow</mat-icon>
                Mark as In Progress
              </button>
              <button mat-button 
                      [color]="question.status === 'completed' ? 'accent' : 'primary'"
                      (click)="updateStatus(question.id, 'completed')">
                <mat-icon>check_circle</mat-icon>
                Mark as Completed
              </button>
              <button mat-button 
                      (click)="updateStatus(question.id, 'not-started')"
                      *ngIf="question.status !== 'not-started'">
                <mat-icon>refresh</mat-icon>
                Reset
              </button>
            </mat-card-actions>
          </mat-card>

          <div class="no-results" *ngIf="filteredQuestions.length === 0">
            <mat-icon>search_off</mat-icon>
            <h3>No questions found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        </div>
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

    .filters-section {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666;
    }

    .question-card {
      margin-bottom: 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
      border-left: 4px solid #2196F3;
    }

    .question-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .difficulty-easy {
      border-left-color: #4CAF50;
    }

    .difficulty-medium {
      border-left-color: #FF9800;
    }

    .difficulty-hard {
      border-left-color: #f44336;
    }

    .question-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .category-badge {
      background: #2196F3;
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

    .difficulty-easy {
      background: #4CAF50;
    }

    .difficulty-medium {
      background: #FF9800;
    }

    .difficulty-hard {
      background: #f44336;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }

    .status-not-started {
      background: #9e9e9e;
    }

    .status-in-progress {
      background: #ff9800;
    }

    .status-completed {
      background: #4caf50;
    }

    .question-description {
      color: #555;
      line-height: 1.6;
      margin: 16px 0;
    }

    .tags-section {
      margin: 16px 0;
    }

    .notes-panel {
      margin: 16px 0;
    }

    .notes-panel .mat-expansion-panel-header {
      padding: 0 16px;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .filters-section {
        grid-template-columns: 1fr;
      }
      
      .results-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .question-meta {
        flex-wrap: wrap;
      }
    }
  `]
})
export class PracticeComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  selectedDifficulty = 'all';
  statusFilter = 'all';
  private subscription = new Subscription();

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
        this.filterQuestions();
      })
    );

    // Check for category filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filterQuestions();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterQuestions() {
    this.filteredQuestions = this.questionService.searchQuestions(
      this.searchTerm,
      this.selectedCategory,
      this.selectedDifficulty
    );

    if (this.statusFilter !== 'all') {
      this.filteredQuestions = this.filteredQuestions.filter(q => q.status === this.statusFilter);
    }
  }

  updateStatus(questionId: string, status: Question['status']) {
    this.questionService.updateQuestionStatus(questionId, status);
    this.snackBar.open(`Question ${this.formatStatus(status)}!`, 'Close', { duration: 2000 });
  }

  updateNotes(questionId: string, notes: string) {
    this.questionService.updateQuestionNotes(questionId, notes);
  }

  formatStatus(status: string): string {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getStatusIcon(status: string): string {
    const icons = {
      'not-started': 'radio_button_unchecked',
      'in-progress': 'schedule',
      'completed': 'check_circle'
    };
    return icons[status as keyof typeof icons] || 'help';
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
}