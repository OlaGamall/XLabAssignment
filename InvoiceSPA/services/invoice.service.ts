import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice } from 'models/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  url:string = environment.ApiUrl+"api/invoice/";
  constructor(private http:HttpClient) { }

  getInvoice(id:number){
    return this.http.get<Invoice>(this.url+id);
  }

  updateInvoice(invoice:Invoice){
    return this.http.put<number>(this.url, invoice);
  }

  deleteInvoice(id:number){
    return this.http.delete<Invoice>(this.url+id);
  }

  addInvoice(invoice:Invoice){
    return this.http.post<Invoice>(this.url, invoice);
  }
}
