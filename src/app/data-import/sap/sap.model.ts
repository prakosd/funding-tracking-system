export interface Sap {
    no: number;
    year: number;
    orderNumber: string;
    budget: number;
    prActual: number;
    prPlan: number;
    poActual: number;
    poPlan: number;
    actualized: number;
    remaining: number;
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
    dueDay: number;
    status: string;
    lastUpdateAt: Date;
    lastUpdateBy: string;
}
