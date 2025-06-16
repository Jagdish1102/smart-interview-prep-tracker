import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProgressData {
  date: string;
  questionsCompleted: number;
  timeSpent: number; // in minutes
}

export interface UserStats {
  totalQuestions: number;
  completedQuestions: number;
  inProgressQuestions: number;
  currentStreak: number;
  totalTimeSpent: number;
  averageCompletionRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressDataSubject = new BehaviorSubject<ProgressData[]>(this.getInitialProgressData());
  public progressData$ = this.progressDataSubject.asObservable();

  constructor() {}

  private getInitialProgressData(): ProgressData[] {
    const savedProgress = localStorage.getItem('user_progress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }

    // Generate sample progress data for the last 30 days
    const progressData: ProgressData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      progressData.push({
        date: date.toISOString().split('T')[0],
        questionsCompleted: Math.floor(Math.random() * 5),
        timeSpent: Math.floor(Math.random() * 120) + 30 // 30-150 minutes
      });
    }

    this.saveProgressData(progressData);
    return progressData;
  }

  getProgressData(): Observable<ProgressData[]> {
    return this.progressData$;
  }

  updateTodayProgress(questionsCompleted: number, timeSpent: number) {
    const today = new Date().toISOString().split('T')[0];
    const progressData = this.progressDataSubject.value;
    const todayIndex = progressData.findIndex(p => p.date === today);

    if (todayIndex >= 0) {
      progressData[todayIndex] = {
        date: today,
        questionsCompleted,
        timeSpent
      };
    } else {
      progressData.push({
        date: today,
        questionsCompleted,
        timeSpent
      });
    }

    this.progressDataSubject.next(progressData);
    this.saveProgressData(progressData);
  }

  getCurrentStreak(): number {
    const progressData = this.progressDataSubject.value;
    let streak = 0;
    
    // Sort by date descending
    const sortedData = [...progressData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const data of sortedData) {
      if (data.questionsCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  getTotalTimeSpent(): number {
    return this.progressDataSubject.value.reduce((total, data) => total + data.timeSpent, 0);
  }

  getWeeklyProgress(): { week: string; completed: number }[] {
    const progressData = this.progressDataSubject.value;
    const weeklyData: { [key: string]: number } = {};

    progressData.forEach(data => {
      const date = new Date(data.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0;
      }
      weeklyData[weekKey] += data.questionsCompleted;
    });

    return Object.entries(weeklyData).map(([week, completed]) => ({
      week,
      completed
    })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }

  private saveProgressData(progressData: ProgressData[]) {
    localStorage.setItem('user_progress', JSON.stringify(progressData));
  }
}