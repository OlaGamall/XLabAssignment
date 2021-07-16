using Microsoft.EntityFrameworkCore;

namespace InvoiceAPI.Models
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Invoice> Invoices { get; set; }
        public virtual DbSet<Invoice_Details> Invoice_Details { get; set; }
    }
}

