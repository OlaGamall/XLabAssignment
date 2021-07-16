using InvoiceAPI.Dtos;
using InvoiceAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceAPI.Services
{
    public class InvoiceRepo : IInvoiceRepo
    {
        private DataContext _context;
        public InvoiceRepo(DataContext context)
        {
            _context = context;
        }

        public async Task<Invoice> GetInvoice(int id)
        {
            return await _context.Invoices.Include(i => i.InvoiceDetails).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<int> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null)
                return 0;

            _context.Invoices.Remove(invoice);
            _context.SaveChanges();
            return 1;
        }

        public async Task<int> InsertInvoice(Invoice inv)
        {
            
            for (int i = 0; i < inv.InvoiceDetails.Count; i++) //instead of making dto to ignore id of invoiceDetails
            {
                inv.InvoiceDetails[i] = new Invoice_Details()
                {
                    ItemName = inv.InvoiceDetails[i].ItemName,
                    Price = inv.InvoiceDetails[i].Price,
                    Quantity = inv.InvoiceDetails[i].Quantity,
                    InvoiceId = inv.InvoiceDetails[i].InvoiceId
                };
            }

            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.Id == inv.Id); 
            if (invoice != null)
                return 0;

            _context.Invoices.Add(inv);
            _context.SaveChanges();
            return 1;
        }

        public async Task<int> UpdateInvoice(Invoice inv)
        {
            var invoice = await _context.Invoices.Include(i => i.InvoiceDetails).FirstOrDefaultAsync(i => i.Id == inv.Id);

            if (invoice == null)
                return 0;

            invoice.ClienName = inv.ClienName;
            invoice.Date = inv.Date;
            invoice.InvoiceDetails = new List<Invoice_Details>();
            foreach (var item in inv.InvoiceDetails)
            {

                invoice.InvoiceDetails.Add(new Invoice_Details()
                {
                    ItemName = item.ItemName,
                    Price = item.Price,
                    Quantity = item.Quantity,
                    InvoiceId = invoice.Id
                });

            }

            _context.SaveChanges();

            return 1;
        }
    }
}
