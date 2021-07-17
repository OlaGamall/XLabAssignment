import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  //form groups
  invoiceForm = new FormGroup({
    "clientName": new FormControl(),
    "invoiceNum": new FormControl(),
    "date": new FormControl(),
  });

  invoiceDetailsForm = new FormGroup({
    "productName": new FormControl(),
    "price": new FormControl(),
    "quantity": new FormControl(),
  });

  editproductForm = new FormGroup({
    "productName": new FormControl(),
    "price": new FormControl(),
    "quantity": new FormControl(),
  });
  /////

  constructor(private invoiceServ:InvoiceService) {
  }
  
  ngOnInit(): void {
    this.uniqueId = -2; //id of new added rows to recognize it in the api from the old rows
    this.itemToEdit = {id:-1, itemName:"", price:0, quantity:0}; //holds the values of table item when I edit
    this.newItem = {id:null, itemName:"", price:null, quantity:null,}; //holds the values of new item to add to table
    this.idToEdit=-1; //I use it to know which row to edit
    this.invoice = {id:null, clienName:"", invoiceDetails:[]}; //holds the existing invoice data
    
  }
 
  //functions that use the service
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
    
    if(!this.invoiceForm.valid || this.invoice.invoiceDetails.length < 1){
      alert("you should enter all invoice data with one product at least!");
    }
    else{
      this.invoiceServ.addInvoice(this.invoice).subscribe(
        _ => {
          alert("Inserted Successfully");
          this.clear();
        },
        error => alert("Invoice number already exists!")
      )
    }
  }

  updateInvoice(){
    
    if(!this.invoiceForm.valid || this.invoice.invoiceDetails.length < 1){
      alert("you should enter all invoice data with one product at least!");
    }
    else{
      this.invoiceServ.updateInvoice(this.invoice).subscribe(
        _ => {
          alert("Updated Successfully");
          this.clear();
        },
        error => alert("There is no invoice with that number!")
      )
    }
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
  
  ////////////////////////////////////////////////////////////////////////////

  clear(){
    this.idToSearch = null;
    this.totalBill = 0;
    this.invoice = {
      id:null,
      clienName:"",
      invoiceDetails:[]
    };
  }

  editRow(id:number){ //make the row at the edit mode
    var result = this.invoice.invoiceDetails.find(i => i.id == id);
    if(result){
      this.idToEdit = id;
      this.itemToEdit.itemName = result.itemName;
      this.itemToEdit.price =  result.price;
      this.itemToEdit.quantity = result.quantity;
    }   

  }

  saveEditedRow(id:number){ //save edited row
    if(!this.editproductForm.valid)
      alert("All fields are required");
    else{
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
    
  }

  deleteRow(index:number){  //delete row from the table
    var result = confirm("هل انت متأكد أنك تريد حذف هذا المنتج؟");
    var i = this.invoice.invoiceDetails[index];
    this.totalBill -= i.price*i.quantity;
    if(result)
      this.invoice.invoiceDetails?.splice(index, 1);
    
  }

  addNewItem(){ //to add new row to the table
    if(!this.invoiceDetailsForm.valid){
      alert("all fields are required");
    }
    else{
      this.newItem.id = this.uniqueId--;
      this.invoice.invoiceDetails.push(
        this.newItem
      );
      this.totalBill += this.newItem.price*this.newItem.quantity;
      this.newItem = {id:null, itemName:"", price:null, quantity:null};
    }
  }

  cancel(){ //cancel row edits 
    this.idToEdit = -1;
  }

}
