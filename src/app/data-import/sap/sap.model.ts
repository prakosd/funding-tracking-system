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
    utilized: number;
    percentUtilized: number;
    remaining: number;
    transactions: Transaction[];
}

export interface Transaction {
    id: string;
    no: number;
    year: number;
    orderNumber: string;
    prNumber: string;
    poNumber: string;
    grNumber: string;
    subject: string;
    items: { name: string, value: number; }[];
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
