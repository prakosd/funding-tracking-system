export interface SapEas {
  id: string;
  year: number;
  month: number;
  requisitionNumber: string;
  subject: string;
  currency: string;
  amount: number;
  dept: string;
  costCenter: string;
  requestor: string;
  status: string;
  creationDate: Date;
  approver: string;
  recipient: string;
  etaRequest: Date;
  isLocked: boolean;
  isLinked: boolean;
  remark: string;
  lastUpdateAt: Date;
  lastUpdateBy: string;
}
