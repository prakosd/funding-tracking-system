import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SapCommitment } from './sap-commitment.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/sap-commitments/';

@Injectable({ providedIn: 'root' })

export class SapCommitmentService {
  constructor(private http: HttpClient) {}

  getMany(year: number) {
    const queryParams = `?year=${year}&sorts=orderNumber documentNumber position`;
    return this.http.get<{ message: string; sapCommitments: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, sapCommitments: result.sapCommitments.map(data => {
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
      return { message: result.message, sapCommitment: {
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

  createOne(newOne: SapCommitment) {
    const newData = new FormData();
    newData.append('orderNumber', newOne.orderNumber);
    newData.append('category', newOne.category);
    newData.append('documentNumber', newOne.documentNumber);
    newData.append('position', newOne.position.toString());
    newData.append('costElement', newOne.costElement);
    newData.append('name', newOne.name);
    newData.append('quantity', newOne.quantity.toString());
    newData.append('uom', newOne.uom);
    newData.append('currency', newOne.currency);
    newData.append('actualValue', newOne.actualValue.toString());
    newData.append('planValue', newOne.planValue.toString());
    newData.append('documentDate', new Date(newOne.documentDate).toISOString());
    newData.append('debitDate', new Date(newOne.debitDate).toISOString());
    newData.append('username', newOne.username);
    newData.append('remark', newOne.remark);
    newData.append('isLocked', newOne.isLocked.toString() || 'false');
    newData.append('isLinked', newOne.isLinked.toString() || 'true');
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, newData);
  }

  patchOne(id: string, newOne: SapCommitment) {
    const newData = new FormData();
    newData.append('orderNumber', newOne.orderNumber);
    newData.append('category', newOne.category);
    newData.append('documentNumber', newOne.documentNumber);
    newData.append('position', newOne.position.toString());
    newData.append('costElement', newOne.costElement);
    newData.append('name', newOne.name);
    newData.append('quantity', newOne.quantity.toString());
    newData.append('uom', newOne.uom);
    newData.append('currency', newOne.currency);
    newData.append('actualValue', newOne.actualValue.toString());
    newData.append('planValue', newOne.planValue.toString());
    newData.append('documentDate', new Date(newOne.documentDate).toISOString());
    newData.append('debitDate', new Date(newOne.debitDate).toISOString());
    newData.append('username', newOne.username);
    newData.append('remark', newOne.remark);
    newData.append('isLocked', newOne.isLocked.toString());
    newData.append('isLinked', newOne.isLinked.toString());
    return this.http.patch<{ message: string; id: string }>(BACKEND_URL + id, newData);
  }

  updateOne(data: SapCommitment) {
    const newData = new FormData();
    newData.append('orderNumber', data.orderNumber);
    newData.append('category', data.category);
    newData.append('documentNumber', data.documentNumber);
    newData.append('position', data.position.toString());
    newData.append('costElement', data.costElement);
    newData.append('name', data.name);
    newData.append('quantity', data.quantity.toString());
    newData.append('uom', data.uom);
    newData.append('currency', data.currency);
    newData.append('actualValue', data.actualValue.toString());
    newData.append('planValue', data.planValue.toString());
    newData.append('documentDate', new Date(data.documentDate).toISOString());
    newData.append('debitDate', new Date(data.debitDate).toISOString());
    newData.append('username', data.username);
    newData.append('remark', data.remark);
    newData.append('isLocked', data.isLocked ? data.isLocked.toString() : 'false');
    newData.append('isLinked', data.isLinked ? data.isLinked.toString() : 'true');
    return this.http.put<{ message: string; id: string }>(BACKEND_URL + (data.id ? data.id : ''), newData);
  }

  deleteOne(id: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + id);
  }

  deleteMany() {
    return this.http.delete<{ message: string }>(BACKEND_URL);
  }

  setLink(id: string, value: boolean) {
    const set = { isLinked: value };
    return this.http.patch<{ message: string; id: string }>(BACKEND_URL + id, set);
  }

  setLock(id: string, value: boolean) {
    const set = { isLocked: value };
    return this.http.patch<{ message: string; id: string }>(BACKEND_URL + id, set);
  }

  setRemark(id: string, value: string) {
    const set = { remark: value };
    return this.http.patch<{ message: string; id: string }>(BACKEND_URL + id, set);
  }

  getLock(orderNumber: string, documentNumber: string, position: number) {
    const queryParams = `?ordernumber=${orderNumber}&documentnumber=${documentNumber}&position=${position}&fields=isLocked`;
    return this.http.get<{ message: string; data: any }>(BACKEND_URL + queryParams);
  }
}
