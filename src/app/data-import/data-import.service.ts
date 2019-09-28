import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DataImportService {
  private subjectFiscalYear = new BehaviorSubject<number>(0);

  getFiscalYear() {
    return this.subjectFiscalYear.asObservable();
  }

  setFiscalYear(year: number) {
    this.subjectFiscalYear.next(year);
  }
}
