import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from 'models/invoice';
import { InvoiceDetails } from 'models/invoice-details';
import {InvoiceService} from 'services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  uniqueId:number;
  flag:boolean;
  invoice:Invoice;
  idToSearch:number;
  newItem:InvoiceDetails; 
  itemToEdit:InvoiceDetails;
  idToEdit:number;
  totalBill:number = 0;

  invoiceForm = new FormGroup({
    "clientName": new FormControl("", [Validators.required, Validators.minLength(3)]),
    "invoiceNum": new FormControl([Validators.required]),
    "date": new FormControl(Validators.required)
  });
  
  constructor(private invoiceServ:InvoiceService) {
  }
  
  ngOnInit(): void {
    this.uniqueId = -2;
    this.itemToEdit = {
      id:-1,
      itemName:"",
      price:0,
      quantity:0,
    };
    
    this.newItem = {
      id:null,
      itemName:"",
      price:null,
      quantity:null,
    };

    this.idToEdit=-1;
    this.invoice = {
      id:null,
      clienName:"",
      invoiceDetails:[]
    };
    
  }
 
  
  getInvoice(){
    this.invoiceServ.getInvoice(this.idToSearch).subscribe(
      d => {
        this.invoice = d;
        this.totalBill = 0;
        d.invoiceDetails.forEach(e => {
          this.totalBill += e.price*e.quantity;
        });
      },
      e => alert("not found")
      
    );
    
  }

  addInvoice(){
    this.invoiceServ.addInvoice(this.invoice).subscribe(
      _ => {
        alert("Inserted Successfully");
        this.clear();
      },
      error => alert("Invoice number already exists!")
    )
  }

  updateInvoice(){
    this.invoiceServ.updateInvoice(this.invoice).subscribe(
      _ => {
        alert("Updated Successfully");
        this.clear();
      },
      error => alert("There is no invoice with that number!")
    )
  }

  deleteInvoice(){
    this.invoiceServ.deleteInvoice(this.invoice.id).subscribe(
      _ => {
        alert("Deleted Successfully");
        this.clear();
      },
      error => alert("There is no invoice with that number!")
    )
  }
  
  clear(){
    this.idToSearch = null;
    this.totalBill = 0;
    this.invoice = {
      id:null,
      clienName:"",
      invoiceDetails:[]
    };
  }

  /////////////////////////////////////////////////////////////////////
  editRow(id:number){
    var result = this.invoice.invoiceDetails.find(i => i.id == id);
    if(result){
      this.idToEdit = id;
      this.itemToEdit.itemName = result.itemName;
      this.itemToEdit.price =  result.price;
      this.itemToEdit.quantity = result.quantity;
    }   

  }

  saveEditedRow(id:number){
    var result = this.invoice.invoiceDetails.find(i => i.id == id);
    if(result){
      //edit totalBill
      this.totalBill -= result.price*result.quantity;
      this.totalBill += this.itemToEdit.price*this.itemToEdit.quantity;
      //
      result.itemName = this.itemToEdit.itemName;
      result.price = this.itemToEdit.price;
      result.quantity = this.itemToEdit.quantity;
    }
    this.idToEdit = -1;
  }

  deleteRow(index:number){
    var result = confirm("هل انت متأكد أنك تريد حذف هذا المنتج؟");
    var i = this.invoice.invoiceDetails[index];
    this.totalBill -= i.price*i.quantity;
    if(result)
      this.invoice.invoiceDetails?.splice(index, 1);
    
  }

  addNewItem(){
    this.newItem.id = this.uniqueId--;
    this.invoice.invoiceDetails.push(
      this.newItem
    );
    this.totalBill += this.newItem.price*this.newItem.quantity;
    this.newItem = {
      id:null,
      itemName:"",
      price:null,
      quantity:null,
    };

  }

  cancel(){
    this.idToEdit = -1;
  }

}
