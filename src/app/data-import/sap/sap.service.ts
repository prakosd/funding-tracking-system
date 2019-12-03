import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Sap } from './sap.model';
import { ExcelService } from 'src/app/shared/excel.service';

const BACKEND_URL = environment.apiUrl + '/sap/';
@Injectable({ providedIn: 'root' })

export class SapService {
   constructor(
    private http: HttpClient,
    private excelService: ExcelService
   ) {}

  //  getData(year: number, orderNumber: string) {
  //    let queryParams = `${year}/full`;
  //    if (orderNumber) {
  //     queryParams = `${year}/full/${orderNumber}`;
  //   }

  //    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
  //     return { message: result.message, data: result.data.map((row, index) => {
  //       return {
  //         no: index + 1,
  //         year: row.year,
  //         orderNumber: row.orderNumber,
  //         budget: 10000000,
  //         prActual: row.totalPrActual,
  //         prPlan: row.totalPrPlan,
  //         poActual: row.totalPoActual,
  //         poPlan: row.totalPoPlan,
  //         actualized: row.totalGrActual,
  //         remaining: 10000000 - ( row.totalPrActual + row.totalPoActual + row.totalGrActual),
  //         transactions: row.transactions.map((trx, idx) => {
  //           return {
  //             no: idx + 1,
  //             year,
  //             orderNumber: row.orderNumber,
  //             prNumber: trx.prNumber,
  //             poNumber: trx.poNumber,
  //             grNumber: trx.grNumber,
  //             subject: trx.subject,
  //             items: trx.items,
  //             remarks: trx.remarks,
  //             headerTexts: trx.headerTexts,
  //             prValue: trx.prValue,
  //             prPlan: trx.prPlan,
  //             poValue: trx.poValue,
  //             poPlan: trx.poPlan,
  //             grValue: trx.grValue,
  //             requestor: trx.requestor,
  //             issueDate: trx.issueDate,
  //             etaDate: trx.etaDate,
  //             actualDate: trx.actualDate,
  //             dueDay: trx.actualDate ? null : this.getDueDay(trx.etaDate),
  //             lastUpdateAt: trx.lastUpdateAt,
  //             lastUpdateBy: trx.lastUpdateBy
  //           };
  //         })
  //       };
  //     })};
  //   }));
  //  }

   getData(year: number, orderNumber: string) {
    let queryParams = `${year}/sum`;
    if (orderNumber) {
      queryParams = `${year}/sum/${orderNumber}`;
    }
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        const budget = 2000000000;
        return {
          no: index + 1,
          year: row.year,
          orderNumber: row.orderNumber,
          budget,
          prActual: row.totalPrActual,
          prPlan: row.totalPrPlan,
          poActual: row.totalPoActual,
          poPlan: row.totalPoPlan,
          actualized: row.totalGrActual,
          utilized: ( row.totalPrActual + row.totalPoActual + row.totalGrActual ),
          remaining: budget - ( row.totalPrActual + row.totalPoActual + row.totalGrActual),
          percentUtilized: Math.floor(( row.totalPrActual + row.totalPoActual + row.totalGrActual) / budget * 100),
        };
      })};
    }));
  }

  getTransactions(year: number, orderNumber: string) {
    let queryParams;
    if (!orderNumber) {
      queryParams = `${year}/details`;
    } else {
      queryParams = `${year}/details/${orderNumber}`;
    }
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          id: orderNumber + row.prNumber + row.poNumber + row.grNumber,
          no: index + 1,
          year,
          orderNumber: row.orderNumber,
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
          dueDay: this.getDueDay(row.etaDate, row.actualDate, (row.prValue + row.poValue)),
          status: this.getStatus(row.actualDate, row.prValue, row.poValue),
          lastUpdateAt: row.lastUpdateAt,
          lastUpdateBy: row.lastUpdateBy
        };
      })};
    }));
  }

  updatePrToPo(orderNumber: string, prNumber: string, poNumber: string) {
    const queryParams = `prtopos/${orderNumber}/${prNumber}/${poNumber}`;

    return this.http.put<{ message: string; data: any}>(BACKEND_URL + queryParams, null)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  deletePrToPo(orderNumber: string, poNumber: string) {
    const queryParams = `prtopos/${orderNumber}/prs/${poNumber}`;

    return this.http.delete<{ message: string; data: any}>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  updatePrToGr(orderNumber: string, prNumber: string, grNumber: string) {
    const queryParams = `prtogrs/${orderNumber}/${prNumber}/${grNumber}`;

    return this.http.put<{ message: string; data: any}>(BACKEND_URL + queryParams, null)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  deletePrToGr(orderNumber: string, grNumber: string) {
    const queryParams = `prtogrs/${orderNumber}/prs/${grNumber}`;

    return this.http.delete<{ message: string; data: any}>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  updateEtaDate(orderNumber: string, documentNumber: string, etaDate: Date) {
    const queryParams = `commitmenteta/${orderNumber}/${documentNumber}/${new Date(etaDate).toISOString()}`;

    return this.http.put<{ message: string; data: any}>(BACKEND_URL + queryParams, null)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  deleteEtaDate(orderNumber: string, documentNumber: string) {
    const queryParams = `commitmenteta/${orderNumber}/${documentNumber}`;

    return this.http.delete<{ message: string; data: any}>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: result.data};
    }));
  }

  getStatus(actualDate: Date, prValue: number, poValue: number) {
    if ((prValue + poValue) > 0) {
      if (poValue <= 0) {
        return 'PR';
      } else {
        return 'PO';
      }
    }
    if (actualDate) {
      return 'GR';
    } else {
      return '';
    }
  }

  getDueDay(etaDate: Date, actualDate: Date, commitmentValue: number) {
    if (commitmentValue <= 0) {
      return null;
    }
    return Math.floor((new Date().getTime() - new Date(etaDate).getTime()) / (1000 * 3600 * 24));
  }

  exportToExcel(data) {
    this.excelService.exportAsExcelFile(this.mapToExcel(data), 'SapQuery');
  }

  private mapToExcel(data: Sap[]) {
    // return data.map((d, index) => {
    //   const result = {};
    //   let key = 'No';
    //   result[key] = index + 1;
    //   for (key in exportKeyMap) {
    //     if (exportKeyMap.hasOwnProperty(key)) {
    //       result[exportKeyMap[key]] = d[key];
    //     }
    //   }
    //   return result;
    // });

    return data;
  }
}
