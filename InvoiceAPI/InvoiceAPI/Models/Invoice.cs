using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvoiceAPI.Models
{
    public class Invoice
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)] 
        public long Id { get; set; }

        [Required]
        public string ClienName { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public virtual List<Invoice_Details> InvoiceDetails { get; set; }
    }
}
