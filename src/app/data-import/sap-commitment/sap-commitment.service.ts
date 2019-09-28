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
    const queryParams = `?year=${year}`;
    return this.http.get<{ message: string; sapCommitments: any }>(BACKEND_URL + queryParams).pipe(map(result => {
      return { message: result.message, sapCommitments: result.sapCommitments.map(sapCommitment => {
        return {
          id: sapCommitment._id,
          year: new Date(sapCommitment.debitDate).getFullYear(),
          month: new Date(sapCommitment.debitDate).getMonth(),
          lastUpdateAt: sapCommitment.lastUpdateAt,
          lastUpdateBy: sapCommitment.lastUpdateBy,
          orderNumber: sapCommitment.orderNumber,
          category: sapCommitment.category,
          documentNumber: sapCommitment.documentNumber,
          position: sapCommitment.position,
          costElement: sapCommitment.costElement,
          name: sapCommitment.name,
          quantity: sapCommitment.quantity,
          uom: sapCommitment.uom,
          currency: sapCommitment.currency,
          actualValue: sapCommitment.actualValue,
          planValue: sapCommitment.planValue,
          documentDate: sapCommitment.documentDate,
          debitDate: sapCommitment.debitDate,
          username: sapCommitment.username,
          isLocked: sapCommitment.isLocked,
          isLinked: sapCommitment.isLinked
        };
      })};
    }));
  }

  getOne(id: string) {
    return this.http.get<{ message: string; sapCommitment: any }>(BACKEND_URL + id)
    .pipe(map(result => {
      return { message: result.message, sapCommitment: {
          id: result.sapCommitment._id,
          year: new Date(result.sapCommitment.debitDate).getFullYear(),
          month: new Date(result.sapCommitment.debitDate).getMonth(),
          lastUpdateAt: result.sapCommitment.lastUpdateAt,
          lastUpdateBy: result.sapCommitment.lastUpdateBy,
          orderNumber: result.sapCommitment.orderNumber,
          category: result.sapCommitment.category,
          documentNumber: result.sapCommitment.documentNumber,
          position: result.sapCommitment.position,
          costElement: result.sapCommitment.costElement,
          name: result.sapCommitment.name,
          quantity: result.sapCommitment.quantity,
          uom: result.sapCommitment.uom,
          currency: result.sapCommitment.currency,
          actualValue: result.sapCommitment.actualValue,
          planValue: result.sapCommitment.planValue,
          documentDate: result.sapCommitment.documentDate,
          debitDate: result.sapCommitment.debitDate,
          username: result.sapCommitment.username,
          isLocked: result.sapCommitment.isLocked,
          isLinked: result.sapCommitment.isLinked
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
    newData.append('documentDate', newOne.documentDate.toISOString());
    newData.append('debitDate', newOne.debitDate.toISOString());
    newData.append('username', newOne.username);
    newData.append('isLocked', newOne.isLocked.toString());
    newData.append('isLinked', newOne.isLinked.toString());
    return this.http.post<{ message: string; id: string }>(BACKEND_URL, newData);
  }

  updateOne(id: string, newOne: SapCommitment) {
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
    newData.append('documentDate', newOne.documentDate.toISOString());
    newData.append('debitDate', newOne.debitDate.toISOString());
    newData.append('username', newOne.username);
    newData.append('isLocked', newOne.isLocked.toString());
    newData.append('isLinked', newOne.isLinked.toString());
    return this.http.put<{ message: string; id: string }>(BACKEND_URL + id, newData);
  }

  deleteOne(id: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + id);
  }

  setLink(id: string, value: boolean) {
    const set = { isLinked: value };
    return this.http.put<{ message: string; id: string }>(BACKEND_URL + 'setlink/' + id, set);
  }

  setLock(id: string, value: boolean) {
    const set = { isLocked: value };
    return this.http.put<{ message: string; id: string }>(BACKEND_URL + 'setlock/' + id, set);
  }
}
