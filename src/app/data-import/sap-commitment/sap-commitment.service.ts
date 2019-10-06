import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SapCommitment } from './sap-commitment.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataImportComponent } from '../data-import.component';

const BACKEND_URL = environment.apiUrl + '/sap-commitments/';

@Injectable({ providedIn: 'root' })

export class SapCommitmentService {
  constructor(private http: HttpClient) {}

  getMany(year: number) {
    const queryParams = `?year=${year}&sorts=orderNumber documentNumber position`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, data: result.data.map(data => {
        return {
          id: data._id,
          year: new Date(data.debitDate).getFullYear(),
          month: new Date(data.debitDate).getMonth(),
          lastUpdateAt: data.lastUpdateAt,
          lastUpdateBy: data.lastUpdateBy,
          orderNumber: data.orderNumber,
          category: data.category,
          documentNumber: data.documentNumber,
          position: data.position,
          costElement: data.costElement,
          name: data.name,
          quantity: data.quantity,
          uom: data.uom,
          currency: data.currency,
          actualValue: data.actualValue,
          planValue: data.planValue,
          documentDate: data.documentDate,
          debitDate: data.debitDate,
          username: data.username,
          remark: data.remark,
          isLocked: data.isLocked,
          isLinked: data.isLinked
        };
      })};
    }));
  }

  getOne(id: string) {
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + id)
    .pipe(map(result => {
      return { message: result.message, data: {
          id: result.data._id,
          year: new Date(result.data.debitDate).getFullYear(),
          month: new Date(result.data.debitDate).getMonth(),
          lastUpdateAt: result.data.lastUpdateAt,
          lastUpdateBy: result.data.lastUpdateBy,
          orderNumber: result.data.orderNumber,
          category: result.data.category,
          documentNumber: result.data.documentNumber,
          position: result.data.position,
          costElement: result.data.costElement,
          name: result.data.name,
          quantity: result.data.quantity,
          uom: result.data.uom,
          currency: result.data.currency,
          actualValue: result.data.actualValue,
          planValue: result.data.planValue,
          documentDate: result.data.documentDate,
          debitDate: result.data.debitDate,
          username: result.data.username,
          remark: result.data.remark || '',
          isLocked: result.data.isLocked,
          isLinked: result.data.isLinked
      }};
    }));
  }

  createOne(data: SapCommitment) {
    const newForm = new FormData();
    newForm.append('orderNumber', data.orderNumber);
    newForm.append('category', data.category);
    newForm.append('documentNumber', data.documentNumber);
    newForm.append('position', data.position.toString());
    newForm.append('costElement', data.costElement);
    newForm.append('name', data.name);
    newForm.append('quantity', data.quantity.toString());
    newForm.append('uom', data.uom);
    newForm.append('currency', data.currency);
    newForm.append('actualValue', data.actualValue.toString());
    newForm.append('planValue', data.planValue.toString());
    newForm.append('documentDate', new Date(data.documentDate).toISOString());
    newForm.append('debitDate', new Date(data.debitDate).toISOString());
    newForm.append('username', data.username);
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString() || 'false');
    newForm.append('isLinked', data.isLinked.toString() || 'true');
    return this.http.post<{ message: string; data: { _id: string }}>(BACKEND_URL, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  patchOne(id: string, data: SapCommitment) {
    const newForm = new FormData();
    newForm.append('orderNumber', data.orderNumber);
    newForm.append('category', data.category);
    newForm.append('documentNumber', data.documentNumber);
    newForm.append('position', data.position.toString());
    newForm.append('costElement', data.costElement);
    newForm.append('name', data.name);
    newForm.append('quantity', data.quantity.toString());
    newForm.append('uom', data.uom);
    newForm.append('currency', data.currency);
    newForm.append('actualValue', data.actualValue.toString());
    newForm.append('planValue', data.planValue.toString());
    newForm.append('documentDate', new Date(data.documentDate).toISOString());
    newForm.append('debitDate', new Date(data.debitDate).toISOString());
    newForm.append('username', data.username);
    newForm.append('remark', data.remark);
    newForm.append('isLocked', data.isLocked.toString());
    newForm.append('isLinked', data.isLinked.toString());
    return this.http.patch<{ message: string; data: { _id: string }}>(BACKEND_URL + id, newForm)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id }};
    }));
  }

  upsertOne(data: SapCommitment) {
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

  getLock(orderNumber: string, documentNumber: string, position: number) {
    const queryParams = `?ordernumber=${orderNumber}&documentnumber=${documentNumber}&position=${position}&fields=isLocked`;
    return this.http.get<{ message: string; data: { _id: string, isLocked: boolean } }>(BACKEND_URL + queryParams)
    .pipe(
      map(result => { return { message: result.message, data: { id: result.data._id, isLocked: result.data.isLocked }};
    }));
  }
}
