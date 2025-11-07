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

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<Bill>>> GetBillsByPatient(Guid patientId)
    {
        return await _context.Bills
            .Where(b => b.PatientId == patientId)
            .OrderByDescending(b => b.BillingDate)
            .ToListAsync();
    }

    [HttpGet("unpaid")]
    public async Task<ActionResult<IEnumerable<Bill>>> GetUnpaidBills()
    {
        return await _context.Bills
            .Where(b => !b.IsPaid)
            .OrderBy(b => b.BillingDate)
            .ToListAsync();
    }

    [HttpGet("overdue")]
    public async Task<ActionResult<IEnumerable<Bill>>> GetOverdueBills([FromQuery] int days = 30)
    {
        var cutoffDate = DateTime.Now.AddDays(-days);
        return await _context.Bills
            .Where(b => !b.IsPaid && b.BillingDate < cutoffDate)
            .OrderBy(b => b.BillingDate)
            .ToListAsync();
    }

    [HttpPut("{id}/pay")]
    public async Task<IActionResult> MarkAsPaid(Guid id)
    {
        var bill = await _context.Bills.FindAsync(id);
        if (bill == null)
        {
            return NotFound();
        }

        bill.IsPaid = true;
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return NoContent();
    }

    [HttpPost("patient/{patientId}/generate")]
    public async Task<ActionResult<Bill>> GenerateBill(Guid patientId, [FromBody] decimal amount)
    {
        var bill = new Bill
        {
            Id = Guid.NewGuid(),
            PatientId = patientId,
            Amount = amount,
            BillingDate = DateTime.Now,
            IsPaid = false
        };

        _context.Bills.Add(bill);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetBill), new { id = bill.Id }, bill);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetBillingStatistics()
    {
        var totalBills = await _context.Bills.CountAsync();
        var paidBills = await _context.Bills.CountAsync(b => b.IsPaid);
        var unpaidBills = totalBills - paidBills;
        var totalRevenue = await _context.Bills.Where(b => b.IsPaid).SumAsync(b => b.Amount);
        var pendingAmount = await _context.Bills.Where(b => !b.IsPaid).SumAsync(b => b.Amount);
        
        var thisMonthRevenue = await _context.Bills
            .Where(b => b.IsPaid && b.BillingDate.Month == DateTime.Now.Month && b.BillingDate.Year == DateTime.Now.Year)
            .SumAsync(b => b.Amount);

        return Ok(new
        {
            TotalBills = totalBills,
            PaidBills = paidBills,
            UnpaidBills = unpaidBills,
            TotalRevenue = totalRevenue,
            PendingAmount = pendingAmount,
            ThisMonthRevenue = thisMonthRevenue
        });
    }

    [HttpGet("revenue/monthly")]
    public async Task<ActionResult<object>> GetMonthlyRevenue([FromQuery] int year = 0)
    {
        if (year == 0) year = DateTime.Now.Year;
        
        var monthlyRevenue = await _context.Bills
            .Where(b => b.IsPaid && b.BillingDate.Year == year)
            .GroupBy(b => b.BillingDate.Month)
            .Select(g => new { Month = g.Key, Revenue = g.Sum(b => b.Amount) })
            .OrderBy(x => x.Month)
            .ToListAsync();

        return Ok(monthlyRevenue);
    }

    private bool BillExists(Guid id)
    {
        return _context.Bills.Any(e => e.Id == id);
    }
}
