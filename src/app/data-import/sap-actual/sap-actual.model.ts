export interface SapActual {
  id: string;
  year: number;
  month: number;
  orderNumber: string;
  purchasingNumber: string;
  referenceNumber: string;
  position: number;
  costElement: string;
  name: string;
  quantity: number;
  uom: string;
  currency: string;
  actualValue: number;
  documentDate: Date;
  postingDate: Date;
  documentType: string;
  headerText: string;
  isLocked: boolean;
  isLinked: boolean;
  isImported: boolean;
  username: string;
  remark: string;
  lastUpdateAt: Date;
  lastUpdateBy: string;
}
