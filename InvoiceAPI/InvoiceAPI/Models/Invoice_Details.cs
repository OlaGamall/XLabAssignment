using System.ComponentModel.DataAnnotations;

namespace InvoiceAPI.Models
{
    public class Invoice_Details
    {
       
        public int Id { get; set; }

        [Required]
        public string ItemName { get; set; }

        [Required]
        public float Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        public long InvoiceId { get; set; }

        public virtual Invoice Invoice { get; set; }
    }
}
