import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/sap/';
@Injectable({ providedIn: 'root' })

export class SapService {
   constructor(
    private http: HttpClient
   ) {}

   getMany(year: number) {
    const queryParams = `${year}/sum`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          no: index + 1,
          year: row.year,
          orderNumber: row.orderNumber,
          prActual: row.totalPrActual,
          prPlan: row.totalPrPlan,
          poActual: row.totalPoActual,
          poPlan: row.totalPoPlan,
          actualized: row.totalGrActual
        };
      })};
    }));
  }

  getOne(year: number, orderNumber: string) {
    const queryParams = `${year}/sum/${orderNumber}`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          no: index + 1,
          year: row.year,
          orderNumber: row.orderNumber,
          prActual: row.totalPrActual,
          prPlan: row.totalPrPlan,
          poActual: row.totalPoActual,
          poPlan: row.totalPoPlan,
          actualized: row.totalGrActual
        };
      })};
    }));
  }


  getDetails(year: number, orderNumber: string) {
    const queryParams = `${year}/details/${orderNumber}`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          no: index + 1,
          year,
          orderNumber,
          prNumber: row.prNumber,
          poNumber: row.poNumber,
          grNumber: row.grNumber,
          subject: row.subject,
          items: row.items,
          remarks: row.remarks,
          headerTexts: row.headerTexts,
          prValue: row.prValue,
          prPlan: row.prPlan,
          poValue: row.poValue,
          poPlan: row.poPlan,
          grValue: row.grValue,
          requestor: row.requestor,
          issueDate: row.issueDate,
          etaDate: row.etaDate,
          actualDate: row.actualDate,
          lastUpdateAt: row.lastUpdateAt,
          lastUpdateBy: row.lastUpdateBy
        };
      })};
    }));
  }
}
