using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryService.Application.Interfaces;
using InventoryService.Domain.Entities;

namespace InventoryService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public InventoryController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> GetInventoryItems()
    {
        return await _context.InventoryItems.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryItem>> GetInventoryItem(Guid id)
    {
        var inventoryItem = await _context.InventoryItems.FindAsync(id);

        if (inventoryItem == null)
        {
            return NotFound();
        }

        return inventoryItem;
    }

    [HttpPost]
    public async Task<ActionResult<InventoryItem>> PostInventoryItem(InventoryItem inventoryItem)
    {
        _context.InventoryItems.Add(inventoryItem);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetInventoryItem), new { id = inventoryItem.Id }, inventoryItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInventoryItem(Guid id, InventoryItem inventoryItem)
    {
        if (id != inventoryItem.Id)
        {
            return BadRequest();
        }

        _context.InventoryItems.Update(inventoryItem);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InventoryItemExists(id))
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
    public async Task<IActionResult> DeleteInventoryItem(Guid id)
    {
        var inventoryItem = await _context.InventoryItems.FindAsync(id);
        if (inventoryItem == null)
        {
            return NotFound();
        }

        _context.InventoryItems.Remove(inventoryItem);
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> SearchInventoryItems([FromQuery] string? name)
    {
        var query = _context.InventoryItems.AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(i => i.Name.Contains(name));
        }

        return await query.OrderBy(i => i.Name).ToListAsync();
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> GetLowStockItems([FromQuery] int threshold = 10)
    {
        return await _context.InventoryItems
            .Where(i => i.Quantity <= threshold)
            .OrderBy(i => i.Quantity)
            .ToListAsync();
    }

    [HttpPut("{id}/quantity")]
    public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] int newQuantity)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        item.Quantity = newQuantity;
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return NoContent();
    }

    [HttpPost("{id}/restock")]
    public async Task<IActionResult> RestockItem(Guid id, [FromBody] int quantity)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        item.Quantity += quantity;
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return NoContent();
    }

    [HttpPost("{id}/consume")]
    public async Task<IActionResult> ConsumeItem(Guid id, [FromBody] int quantity)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        if (item.Quantity < quantity)
        {
            return BadRequest("Insufficient stock");
        }

        item.Quantity -= quantity;
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return NoContent();
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> GetItemsByCategory(string category)
    {
        return await _context.InventoryItems
            .Where(i => i.IsActive && i.Category.Contains(category))
            .OrderBy(i => i.Name)
            .ToListAsync();
    }

    [HttpGet("expiring")]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> GetExpiringItems([FromQuery] int days = 30)
    {
        var cutoffDate = DateTime.Now.AddDays(days);
        return await _context.InventoryItems
            .Where(i => i.IsActive && i.ExpiryDate.HasValue && i.ExpiryDate <= cutoffDate)
            .OrderBy(i => i.ExpiryDate)
            .ToListAsync();
    }

    [HttpGet("expired")]
    public async Task<ActionResult<IEnumerable<InventoryItem>>> GetExpiredItems()
    {
        return await _context.InventoryItems
            .Where(i => i.IsActive && i.ExpiryDate.HasValue && i.ExpiryDate < DateTime.Now)
            .OrderBy(i => i.ExpiryDate)
            .ToListAsync();
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetInventoryStatistics()
    {
        var totalItems = await _context.InventoryItems.CountAsync(i => i.IsActive);
        var lowStockItems = await _context.InventoryItems.CountAsync(i => i.IsActive && i.Quantity <= i.MinimumStock);
        var totalValue = await _context.InventoryItems.Where(i => i.IsActive).SumAsync(i => i.Price * i.Quantity);
        var outOfStockItems = await _context.InventoryItems.CountAsync(i => i.IsActive && i.Quantity == 0);
        var expiringItems = await _context.InventoryItems.CountAsync(i => i.IsActive && i.ExpiryDate.HasValue && i.ExpiryDate <= DateTime.Now.AddDays(30));
        
        var categoryStats = await _context.InventoryItems
            .Where(i => i.IsActive)
            .GroupBy(i => i.Category)
            .Select(g => new { Category = g.Key, Count = g.Count(), Value = g.Sum(i => i.Price * i.Quantity) })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            LowStockItems = lowStockItems,
            OutOfStockItems = outOfStockItems,
            ExpiringItems = expiringItems,
            TotalInventoryValue = totalValue,
            CategoryBreakdown = categoryStats
        });
    }

    private bool InventoryItemExists(Guid id)
    {
        return _context.InventoryItems.Any(e => e.Id == id);
    }
}
