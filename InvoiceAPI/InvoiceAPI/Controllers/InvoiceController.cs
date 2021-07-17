using InvoiceAPI.Models;
using InvoiceAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private IInvoiceRepo _repo;
        public InvoiceController(IInvoiceRepo repo)
        {
            _repo = repo;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var invoice = await _repo.GetInvoice(id);

            if (invoice == null)
                return NotFound();

            return Ok(invoice);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateInvoice(Invoice invoice)
        {
            int result = await _repo.UpdateInvoice(invoice);

            if (result == 0)
                return NotFound();

            return NoContent();

        }

        [HttpPost]
        public async Task<IActionResult> AddInvoice(Invoice invoice)
        {
           
            int result = await _repo.InsertInvoice(invoice);

            if (result == 0)
                return BadRequest();

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            int result = await _repo.DeleteInvoice(id);

            if (result == 0)
                return NotFound();

            return NoContent();

        }


    }
}
