using InvoiceAPI.Dtos;
using InvoiceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceAPI.Services
{
    public interface IInvoiceRepo
    {
        Task<Invoice> GetInvoice(int id);

        Task<int> InsertInvoice(Invoice inv);

        Task<int> UpdateInvoice(Invoice inv);

        Task<int> DeleteInvoice(int id);
    }
}
