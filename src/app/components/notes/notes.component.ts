import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { QuestionService, Question } from '../../services/question.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    NavbarComponent
  ],
  template: `
    <app-navbar>
      <div class="container">
        <div class="header-section">
          <h1>Personal Notes</h1>
          <p>Review all your saved notes and insights from practice questions</p>
        </div>

        <div class="search-section mb-3">
          <mat-form-field class="search-field">
            <mat-label>Search Notes</mat-label>
            <input matInput [(ngModel)]="searchQuery" (ngModelChange)="filterNotes()" 
                   placeholder="Search by question title or note content">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="stats-section mb-3">
          <div class="stats-card">
            <mat-icon>note</mat-icon>
            <div>
              <h3>{{ notesWithContent.length }}</h3>
              <p>Total Notes</p>
            </div>
          </div>
          <div class="stats-card">
            <mat-icon>category</mat-icon>
            <div>
              <h3>{{ getCategoriesWithNotes().length }}</h3>
              <p>Categories Covered</p>
            </div>
          </div>
        </div>

        <div class="notes-list">
          <mat-card class="note-card" *ngFor="let question of filteredNotes">
            <mat-card-header>
              <div class="note-header">
                <div class="question-meta">
                  <span class="category-badge" [style.backgroundColor]="getCategoryColor(question.category)">
                    {{ question.category }}
                  </span>
                  <span class="difficulty-badge" [ngClass]="'difficulty-' + question.difficulty.toLowerCase()">
                    {{ question.difficulty }}
                  </span>
                </div>
                <div class="note-actions">
                  <button mat-icon-button (click)="clearNote(question.id)" 
                          matTooltip="Clear note">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card-header>

            <mat-card-content>
              <h3 class="question-title">{{ question.title }}</h3>
              <p class="question-description">{{ question.description }}</p>
              
              <div class="tags-section" *ngIf="question.tags.length > 0">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let tag of question.tags">{{ tag }}</mat-chip>
                </mat-chip-listbox>
              </div>

              <div class="note-content">
                <h4>
                  <mat-icon>note</mat-icon>
                  Your Notes
                </h4>
                <mat-form-field class="full-width">
                  <mat-label>Edit your notes</mat-label>
                  <textarea matInput rows="4" 
                           [ngModel]="question.notes" 
                           (ngModelChange)="updateNote(question.id, $event)"
                           placeholder="Add your thoughts, solution approach, or key points..."></textarea>
                </mat-form-field>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <div class="card-footer">
                <div class="last-updated">
                  <mat-icon>schedule</mat-icon>
                  <span>Status: {{ formatStatus(question.status) }}</span>
                </div>
              </div>
            </mat-card-actions>
          </mat-card>

          <div class="no-notes" *ngIf="filteredNotes.length === 0 && searchQuery">
            <mat-icon>search_off</mat-icon>
            <h3>No notes found</h3>
            <p>No notes match your search criteria</p>
          </div>

          <div class="no-notes" *ngIf="notesWithContent.length === 0 && !searchQuery">
            <mat-icon>note_add</mat-icon>
            <h3>No notes yet</h3>
            <p>Start adding notes to your practice questions to see them here</p>
            <button mat-raised-button color="primary" routerLink="/practice">
              <mat-icon>quiz</mat-icon>
              Go to Practice
            </button>
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

    .search-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-field {
      width: 100%;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stats-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stats-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stats-card h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .stats-card p {
      margin: 0;
      opacity: 0.9;
    }

    .note-card {
      margin-bottom: 16px;
      border-radius: 12px;
      border-left: 4px solid #2196F3;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    .question-meta {
      display: flex;
      gap: 8px;
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

    .difficulty-easy {
      background: #4CAF50;
    }

    .difficulty-medium {
      background: #FF9800;
    }

    .difficulty-hard {
      background: #f44336;
    }

    .question-title {
      color: #333;
      margin: 16px 0 8px 0;
    }

    .question-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .tags-section {
      margin-bottom: 20px;
    }

    .note-content h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2196F3;
      margin-bottom: 16px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .last-updated {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 14px;
    }

    .no-notes {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-notes mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .stats-section {
        grid-template-columns: 1fr;
      }
      
      .note-header {
        flex-direction: column;
        gap: 10px;
      }
      
      .question-meta {
        flex-wrap: wrap;
      }
    }
  `]
})
export class NotesComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  notesWithContent: Question[] = [];
  filteredNotes: Question[] = [];
  searchQuery = '';
  private subscription = new Subscription();

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.subscription.add(
      this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
        this.notesWithContent = questions.filter(q => q.notes && q.notes.trim().length > 0);
        this.filterNotes();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterNotes() {
    if (!this.searchQuery.trim()) {
      this.filteredNotes = this.notesWithContent;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredNotes = this.notesWithContent.filter(question =>
      question.title.toLowerCase().includes(query) ||
      question.description.toLowerCase().includes(query) ||
      (question.notes && question.notes.toLowerCase().includes(query)) ||
      question.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  updateNote(questionId: string, notes: string) {
    this.questionService.updateQuestionNotes(questionId, notes);
  }

  clearNote(questionId: string) {
    this.questionService.updateQuestionNotes(questionId, '');
  }

  getCategoriesWithNotes(): string[] {
    const categories = new Set(this.notesWithContent.map(q => q.category));
    return Array.from(categories);
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
}