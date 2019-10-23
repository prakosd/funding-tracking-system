import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProgressData {
  index: number;
  length: number;
  progress: string;
  percentage: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressDataService {
  private progressData = new BehaviorSubject<ProgressData>({
    index: 0,
    length: 0,
    progress: '',
    percentage: '',
    message: 'Please Wait'
  });
  constructor() { }

  getLoadingProgress(): Observable<ProgressData> {
    return this.progressData.asObservable();
  }

  resetLoadingProgress() {
    const newProgress: ProgressData = {
      index: 0,
      length: 0,
      progress: '',
      percentage: '',
      message: 'Please Wait'
    };
    this.progressData.next(newProgress);
  }

  private getMessage(percentage: number): string {
    const quarter = percentage / 25;

    if (quarter >= 3) {
      return 'Almost There';
    } else if (quarter >= 2) {
      return 'Halfway Through';
    } else if (quarter >= 1) {
      return 'Looking Good';
    } else {
      return 'Please Wait';
    }
  }

  setLoadingProgress(index: number, length: number) {
    const progress = index + ' of ' + length;
    const percentage = (index / length * 100);
    const message = this.getMessage(percentage);
    const newProgress: ProgressData = {
      index,
      length,
      progress,
      percentage: percentage.toFixed(0) + '%',
      message
    };
    this.progressData.next(newProgress);
  }
}
