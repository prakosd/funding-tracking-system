import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SapEas } from './sap-eas.model';
import { map } from 'rxjs/operators';
import { ExcelService } from '../../shared/excel.service';
import { ProgressDataService } from '../../shared/progress-data.service';

const BACKEND_URL = environment.apiUrl + '/sap-eas/';
const importKeyMap = {
  requisitionNumber: 'Requisition No',
  subject: 'Subject',
  amount: 'Amount',
  dept: 'Dept',
  costCenter: 'Cost Center',
  requestor: 'Requestor',
  status: 'Status',
  creationDate: 'Creation Date',
  approver: 'Current Approver',
  recipient: 'Recipient',
  etaRequest: 'ETA Request'
};

const exportKeyMap = {
  year: 'Year',
  month: 'Month',
  requisitionNumber: 'PR No.',
  subject: 'Subject',
  currency: 'Curr.',
  amount: 'Amount',
  dept: 'Dept.',
  costCenter: 'Cost Center',
  requestor: 'Requestor',
  status: 'Status',
  creationDate: 'Creation Date',
  approver: 'Approval',
  recipient: 'Recipient',
  etaRequest: 'ETA Request',
  isLocked: 'Locked',
  isLinked: 'Linked',
  remark: 'Remark',
  lastUpdateAt: 'Last Update at',
  lastUpdateBy: 'Last Update by',
  id: 'id'
};

@Injectable({ providedIn: 'root' })

export class SapEasService {
  constructor(
    private http: HttpClient,
    private excelService: ExcelService,
    private progressDataService: ProgressDataService
    ) {}

  getMany(year: number) {
    const queryParams = `?year=${year}&sorts=-creationDate`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          no: index + 1,
          id: row._id,
          year: new Date(row.etaRequest).getFullYear(),
          month: new Date(row.etaRequest).getMonth(),
          requisitionNumber: row.requisitionNumber,
          subject: row.subject,
          currency: row.currency,
          amount: row.amount,
          dept: row.dept,
          costCenter: row.costCenter,
          requestor: row.requestor,
          status: row.status,
          creationDate: row.creationDate,
          approver: row.approver,
          recipient: row.recipient,
          etaRequest: row.etaRequest,
          remark: row.remark,
          isLocked: row.isLocked,
          isLinked: row.isLinked,
          lastUpdateAt: row.lastUpdateAt,
          lastUpdateBy: row.lastUpdateBy
        };
      })};
    }));
  }

  getOne(id: string) {
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + id)
    .pipe(map(row => {
      return { message: row.message, data: {
          id: row.data._id,
          year: new Date(row.data.etaRequest).getFullYear(),
          month: new Date(row.data.etaRequest).getMonth(),
          requisitionNumber: row.data.requisitionNumber,
          subject: row.data.subject,
          currency: row.data.currency,
          amount: row.data.amount,
          dept: row.data.dept,
          costCenter: row.data.costCenter,
          requestor: row.data.requestor,
          status: row.data.status,
          creationDate: row.data.creationDate,
          approver: row.data.approver,
          recipient: row.data.recipient,
          etaRequest: row.data.etaRequest,
          remark: row.data.remark,
          isLocked: row.data.isLocked,
          isLinked: row.data.isLinked,
          lastUpdateAt: row.data.lastUpdateAt,
          lastUpdateBy: row.data.lastUpdateBy
      }};
    }));
  }

  createOne(data: SapEas) {
    const newForm = new FormData();
    newForm.append('requisitionNumber', data.requisitionNumber);
    newForm.append('subject', data.subject);
    newForm.append('currency', data.currency);
    newForm.append('amount', data.amount.toString());
    newForm.append('dept', data.dept);
    newForm.append('costCenter', data.costCenter);
    newForm.append('requestor', data.requestor);
    newForm.append('status', data.status);
    newForm.append('creationDate', new Date(data.creationDate).toISOString());
    newForm.append('approver', data.approver);
    newForm.append('recipient', data.recipient);
    newForm.append('etaRequest', new Date(data.etaRequest).toISOString());
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString() || 'false');
    newForm.append('isLinked', data.isLinked.toString() || 'true');
    return this.http.post<{ message: string; data: { _id: string }}>(BACKEND_URL, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  patchOne(id: string, data: SapEas) {
    const newForm = new FormData();
    newForm.append('requisitionNumber', data.requisitionNumber);
    newForm.append('subject', data.subject);
    newForm.append('currency', data.currency);
    newForm.append('amount', data.amount.toString());
    newForm.append('dept', data.dept);
    newForm.append('costCenter', data.costCenter);
    newForm.append('requestor', data.requestor);
    newForm.append('status', data.status);
    newForm.append('creationDate', new Date(data.creationDate).toISOString());
    newForm.append('approver', data.approver);
    newForm.append('recipient', data.recipient);
    newForm.append('etaRequest', new Date(data.etaRequest).toISOString());
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString() || 'false');
    newForm.append('isLinked', data.isLinked.toString() || 'true');
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  upsertOne(data: SapEas) {
    return this.http.put<{ message: string; data: { _id: string }}>(BACKEND_URL + (data.id ? data.id : ''), data)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  deleteOne(id: string) {
    return this.http.delete<{ message: string; data: { _id: string }}>(BACKEND_URL + id)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  deleteMany() {
    return this.http.delete<{ message: string }>(BACKEND_URL);
  }

  setLink(id: string, value: boolean) {
    const set = { isLinked: value };
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, set)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  setLock(id: string, value: boolean) {
    const set = { isLocked: value };
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, set)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  setRemark(id: string, value: string) {
    const set = { remark: value };
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, set)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  getLock(requisitionNumber: string) {
    const queryParams = `?requisitionNumber=${requisitionNumber}&fields=isLocked`;
    return this.http.get<{ message: string; data: { _id: string, isLocked: boolean } }>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id, isLocked: result.data.isLocked }};
    }));
  }

  exportToExcel(data: SapEas[]) {
    this.excelService.exportAsExcelFile(this.mapToExcel(data), 'SapEas');
  }

  private mapToExcel(data: SapEas[]) {
    return data.map((d, index) => {
      const result = {};
      let key = 'No';
      result[key] = index + 1;
      for (key in exportKeyMap) {
        if (exportKeyMap.hasOwnProperty(key)) {
          result[exportKeyMap[key]] = d[key];
        }
      }
      return result;
    });
  }

  async importFromExcel(arrayBuffer: ArrayBuffer) {
    const json = await this.excelService.toJson(arrayBuffer).catch(error => { console.log(error); });
    if (!json) { return false; }
    const data = this.mapJson(json);
    const upsertRes =  await this.upsertMany(data).catch(error => { console.log(error); });
    if (!upsertRes) { return false; }

    return true;
  }


  private mapJson(json: any[]) {
    const results: any[] = [];
    for (const data of json) {
      const result = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const mappedKey = this.mapKey(key);
          result[mappedKey] = data[key];
        }
      }
      results.push(result);
    }
    return results.filter(r => r.requisitionNumber !== null && r.requisitionNumber !== undefined);
  }

  private mapKey(findKey: string) {
     for (const key in importKeyMap) {
        if (importKeyMap.hasOwnProperty(key)) {
          if (importKeyMap[key] === findKey) {
            return key;
          }
        }
      }
  }

  async upsertMany(data: SapEas[]) {
    const length = data.length;
    let index = 0;
    this.progressDataService.resetLoadingProgress();
    for (const d of data) {
      const lockRes = await this.getLock(d.requisitionNumber)
      .toPromise().catch(error => { console.log(error); });
      if (!lockRes) { return false; }

      if (!lockRes.data.isLocked) {
        const upsertRes = await this.upsertOne(d).toPromise().catch(error => { console.log(error); });
        if (!upsertRes) { return false; }
      }
      index += 1;
      this.progressDataService.setLoadingProgress(index, length);
    }
    this.progressDataService.resetLoadingProgress();
    return true;
  }
}
