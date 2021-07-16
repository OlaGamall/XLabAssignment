import { InvoiceDetails } from "./invoice-details";

export interface Invoice {
    id:number;
    clienName:string;
    date?:Date;
    invoiceDetails:InvoiceDetails[];
}

