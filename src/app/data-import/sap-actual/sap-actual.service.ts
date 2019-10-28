import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SapActual } from './sap-actual.model';
import { map } from 'rxjs/operators';
import { ExcelService } from '../../shared/excel.service';
import { ProgressDataService } from '../../shared/progress-data.service';

const BACKEND_URL = environment.apiUrl + '/sap/actuals/';
const importKeyMap = {
  year: 'Fiscal Year',
  month: 'Period',
  orderNumber: 'Order',
  purchasingNumber: 'Purchasing Document',
  referenceNumber: 'Ref Document Number',
  position: 'Posting row',
  costElement: 'Cost Element',
  name: 'Name',
  quantity: 'Total quantity',
  uom: 'Posted unit of meas.',
  currency: 'Report currency',
  actualValue: 'Val.in rep.cur.',
  documentDate: 'Document Date',
  postingDate: 'Posting Date',
  documentType: 'Document type',
  headerText: 'Document Header Text',
  username: 'User Name',
};

const exportKeyMap = {
  year: 'Year',
  month: 'Month',
  orderNumber: 'Order',
  purchasingNumber: 'PO No.',
  referenceNumber: 'GR No.',
  position: 'Pos',
  costElement: 'Cost Element',
  name: 'Name',
  quantity: 'Qty',
  uom: 'UoM',
  currency: 'Currency',
  actualValue: 'Actual Value',
  documentDate: 'Document Date',
  postingDate: 'Posting Date',
  documentType: 'Doc. Type',
  headerText: 'Header Text',
  isLocked: 'Locked',
  isLinked: 'Linked',
  username: 'Username',
  remark: 'Remark',
  lastUpdateAt: 'Last Update at',
  lastUpdateBy: 'Last Update by',
  id: 'id'
};

@Injectable({ providedIn: 'root' })

export class SapActualService {
   constructor(
     private http: HttpClient,
     private excelService: ExcelService,
     private progressDataService: ProgressDataService
     ) {}

  getMany(year: number) {
    const queryParams = `?year=${year}&sorts=orderNumber -postingDate purchasingNumber referenceNumber position`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map((row, index) => {
        return {
          no: index + 1,
          id: row._id,
          year: new Date(row.postingDate).getFullYear(),
          month: new Date(row.postingDate).getMonth(),
          orderNumber: row.orderNumber,
          purchasingNumber: row.purchasingNumber,
          referenceNumber: row.referenceNumber,
          position: row.position,
          costElement: row.costElement,
          name: row.name,
          quantity: row.quantity,
          uom: row.uom,
          currency: row.currency,
          actualValue: row.actualValue,
          documentDate: row.documentDate,
          postingDate: row.postingDate,
          documentType: row.documentType,
          headerText: row.headerText,
          username: row.username,
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
          year: new Date(row.data.postingDate).getFullYear(),
          month: new Date(row.data.postingDate).getMonth(),
          orderNumber: row.data.orderNumber,
          purchasingNumber: row.data.purchasingNumber,
          referenceNumber: row.data.referenceNumber,
          position: row.data.position,
          costElement: row.data.costElement,
          name: row.data.name,
          quantity: row.data.quantity,
          uom: row.data.uom,
          currency: row.data.currency,
          actualValue: row.data.actualValue,
          documentDate: row.data.documentDate,
          postingDate: row.data.postingDate,
          documentType: row.data.documentType,
          headerText: row.data.headerText,
          username: row.data.username,
          remark: row.data.remark || '',
          isLocked: row.data.isLocked,
          isLinked: row.data.isLinked,
          lastUpdateAt: row.data.lastUpdateAt,
          lastUpdateBy: row.data.lastUpdateBy
      }};
    }));
  }

  createOne(data: SapActual) {
    const newForm = new FormData();
    newForm.append('orderNumber', data.orderNumber);
    newForm.append('purchasingNumber', data.purchasingNumber);
    newForm.append('referenceNumber', data.referenceNumber);
    newForm.append('position', data.position.toString());
    newForm.append('costElement', data.costElement);
    newForm.append('name', data.name);
    newForm.append('quantity', data.quantity.toString());
    newForm.append('uom', data.uom);
    newForm.append('currency', data.currency);
    newForm.append('actualValue', data.actualValue.toString());
    newForm.append('documentDate', new Date(data.documentDate).toISOString());
    newForm.append('postingDate', new Date(data.postingDate).toISOString());
    newForm.append('documentType', data.documentType);
    newForm.append('headerText', data.headerText);
    newForm.append('username', data.username);
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString() || 'false');
    newForm.append('isLinked', data.isLinked.toString() || 'true');
    return this.http.post<{ message: string; data: { _id: string }}>(BACKEND_URL, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  patchOne(id: string, data: SapActual) {
    const newForm = new FormData();
    newForm.append('orderNumber', data.orderNumber);
    newForm.append('purchasingNumber', data.purchasingNumber);
    newForm.append('referenceNumber', data.referenceNumber);
    newForm.append('position', data.position.toString());
    newForm.append('costElement', data.costElement);
    newForm.append('name', data.name);
    newForm.append('quantity', data.quantity.toString());
    newForm.append('uom', data.uom);
    newForm.append('currency', data.currency);
    newForm.append('actualValue', data.actualValue.toString());
    newForm.append('documentDate', new Date(data.documentDate).toISOString());
    newForm.append('postingDate', new Date(data.postingDate).toISOString());
    newForm.append('documentType', data.documentType);
    newForm.append('headerText', data.headerText);
    newForm.append('username', data.username);
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString());
    newForm.append('isLinked', data.isLinked.toString());
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  upsertOne(data: SapActual) {
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

  getLock(orderNumber: string, referenceNumber: string, position: number) {
    const queryParams = `?ordernumber=${orderNumber}&referenceNumber=${referenceNumber}&position=${position}&fields=isLocked`;
    return this.http.get<{ message: string; data: { _id: string, isLocked: boolean } }>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id, isLocked: result.data.isLocked }};
    }));
  }

  exportToExcel(data: SapActual[]) {
    this.excelService.exportAsExcelFile(this.mapToExcel(data), 'SapActual');
  }

  private mapToExcel(data: SapActual[]) {
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
    return results.filter(r => r.orderNumber !== null && r.orderNumber !== undefined);
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

  async upsertMany(data: SapActual[]) {
    const length = data.length;
    let index = 0;
    this.progressDataService.resetLoadingProgress();
    for (const d of data) {
      const lockRes = await this.getLock(d.orderNumber, d.referenceNumber, d.position)
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
