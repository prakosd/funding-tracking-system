export interface Sap {
    no: number;
    year: number;
    orderNumber: string;
    prActual: number;
    prPlan: number;
    poActual: number;
    poPlan: number;
    actualized: number;
    transactions: Transaction[];
}

export interface Transaction {
    no: number;
    year: number;
    orderNumber: string;
    prNumber: string;
    poNumber: string;
    grNumber: string;
    subject: string;
    items: string[];
    remarks: string[];
    headerTexts: string[];
    prValue: number;
    prPlan: number;
    poValue: number;
    poPlan: number;
    grValue: number;
    requestor: string;
    issueDate: Date;
    etaDate: Date;
    actualDate: Date;
    lastUpdateAt: Date;
    lastUpdateBy: string;
}
