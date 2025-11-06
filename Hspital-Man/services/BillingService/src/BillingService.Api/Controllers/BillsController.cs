using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillingService.Application.Interfaces;
using BillingService.Domain.Entities;

namespace BillingService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public BillsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bill>>> GetBills()
    {
        return await _context.Bills.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Bill>> GetBill(Guid id)
    {
        var bill = await _context.Bills.FindAsync(id);

        if (bill == null)
        {
            return NotFound();
        }

        return bill;
    }

    [HttpPost]
    public async Task<ActionResult<Bill>> PostBill(Bill bill)
    {
        _context.Bills.Add(bill);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetBill), new { id = bill.Id }, bill);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBill(Guid id, Bill bill)
    {
        if (id != bill.Id)
        {
            return BadRequest();
        }

        _context.Bills.Update(bill);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BillExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBill(Guid id)
    {
        var bill = await _context.Bills.FindAsync(id);
        if (bill == null)
        {
            return NotFound();
        }

        _context.Bills.Remove(bill);
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    private bool BillExists(Guid id)
    {
        return _context.Bills.Any(e => e.Id == id);
    }
}
