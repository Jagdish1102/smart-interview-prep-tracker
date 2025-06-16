import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Question {
  id: string;
  title: string;
  description: string;
  category: 'Java' | 'DSA' | 'DBMS' | 'HR';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  hint?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsSubject = new BehaviorSubject<Question[]>(this.getInitialQuestions());
  public questions$ = this.questionsSubject.asObservable();

  constructor() {}

  private getInitialQuestions(): Question[] {
    const savedQuestions = localStorage.getItem('interview_questions');
    if (savedQuestions) {
      return JSON.parse(savedQuestions);
    }

    const defaultQuestions: Question[] = [
      {
        id: '1',
        title: 'What is Object-Oriented Programming?',
        description: 'Explain the four pillars of OOP and provide examples in Java.',
        category: 'Java',
        difficulty: 'Easy',
        tags: ['OOP', 'Fundamentals'],
        hint: 'Think about Encapsulation, Inheritance, Polymorphism, and Abstraction',
        status: 'not-started',
        notes: ''
      },
      {
        id: '2',
        title: 'Implement Binary Search',
        description: 'Write a function to implement binary search algorithm and analyze its time complexity.',
        category: 'DSA',
        difficulty: 'Medium',
        tags: ['Search', 'Algorithm'],
        hint: 'Use divide and conquer approach',
        status: 'not-started',
        notes: ''
      },
      {
        id: '3',
        title: 'Explain Database Normalization',
        description: 'What are the different normal forms? Explain with examples.',
        category: 'DBMS',
        difficulty: 'Medium',
        tags: ['Normalization', 'Database Design'],
        hint: 'Start with 1NF, 2NF, 3NF',
        status: 'not-started',
        notes: ''
      },
      {
        id: '4',
        title: 'Tell me about yourself',
        description: 'How would you introduce yourself in a professional interview setting?',
        category: 'HR',
        difficulty: 'Easy',
        tags: ['Introduction', 'Personal'],
        hint: 'Keep it professional and relevant to the role',
        status: 'not-started',
        notes: ''
      },
      {
        id: '5',
        title: 'Java Memory Management',
        description: 'Explain heap vs stack memory in Java and garbage collection.',
        category: 'Java',
        difficulty: 'Hard',
        tags: ['Memory', 'JVM'],
        hint: 'Think about object allocation and method calls',
        status: 'not-started',
        notes: ''
      },
      {
        id: '6',
        title: 'Merge Sort Algorithm',
        description: 'Implement merge sort and explain its time and space complexity.',
        category: 'DSA',
        difficulty: 'Medium',
        tags: ['Sorting', 'Divide and Conquer'],
        hint: 'Use recursive approach',
        status: 'not-started',
        notes: ''
      }
    ];

    this.saveQuestions(defaultQuestions);
    return defaultQuestions;
  }

  getQuestions(): Observable<Question[]> {
    return this.questions$;
  }

  getQuestionsByCategory(category: string): Question[] {
    return this.questionsSubject.value.filter(q => q.category === category);
  }

  updateQuestionStatus(questionId: string, status: Question['status']) {
    const questions = this.questionsSubject.value.map(q => 
      q.id === questionId ? { ...q, status } : q
    );
    this.questionsSubject.next(questions);
    this.saveQuestions(questions);
  }

  updateQuestionNotes(questionId: string, notes: string) {
    const questions = this.questionsSubject.value.map(q => 
      q.id === questionId ? { ...q, notes } : q
    );
    this.questionsSubject.next(questions);
    this.saveQuestions(questions);
  }

  addQuestion(question: Omit<Question, 'id' | 'status' | 'notes'>) {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      status: 'not-started',
      notes: ''
    };
    const questions = [...this.questionsSubject.value, newQuestion];
    this.questionsSubject.next(questions);
    this.saveQuestions(questions);
  }

  deleteQuestion(questionId: string) {
    const questions = this.questionsSubject.value.filter(q => q.id !== questionId);
    this.questionsSubject.next(questions);
    this.saveQuestions(questions);
  }

  getCategories(): Category[] {
    const questions = this.questionsSubject.value;
    const categories = ['Java', 'DSA', 'DBMS', 'HR'];
    
    return categories.map(cat => {
      const categoryQuestions = questions.filter(q => q.category === cat);
      const completed = categoryQuestions.filter(q => q.status === 'completed').length;
      
      return {
        name: cat,
        icon: this.getCategoryIcon(cat),
        color: this.getCategoryColor(cat),
        total: categoryQuestions.length,
        completed
      };
    });
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Java': 'code',
      'DSA': 'account_tree',
      'DBMS': 'storage',
      'HR': 'people'
    };
    return icons[category] || 'help';
  }

  private getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Java': '#f44336',
      'DSA': '#4caf50',
      'DBMS': '#2196f3',
      'HR': '#ff9800'
    };
    return colors[category] || '#9e9e9e';
  }

  private saveQuestions(questions: Question[]) {
    localStorage.setItem('interview_questions', JSON.stringify(questions));
  }

  searchQuestions(searchTerm: string, category?: string, difficulty?: string): Question[] {
    let filtered = this.questionsSubject.value;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(q => q.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    return filtered;
  }
}