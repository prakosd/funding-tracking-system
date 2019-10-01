export interface SapCommitment {
  id: string;
  year: number;
  month: number;
  orderNumber: string;
  category: string;
  documentNumber: string;
  position: number;
  costElement: string;
  name: string;
  quantity: number;
  uom: string;
  currency: string;
  actualValue: number;
  planValue: number;
  documentDate: Date;
  debitDate: Date;
  username: string;
  remark: string;
  lastUpdateAt: Date;
  lastUpdateBy: string;
  isLocked: boolean;
  isLinked: boolean;
}
