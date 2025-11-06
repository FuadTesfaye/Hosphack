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

    private bool InventoryItemExists(Guid id)
    {
        return _context.InventoryItems.Any(e => e.Id == id);
    }
}
