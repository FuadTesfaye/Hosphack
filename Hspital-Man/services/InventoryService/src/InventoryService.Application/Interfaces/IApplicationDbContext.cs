using Microsoft.EntityFrameworkCore;
using InventoryService.Domain.Entities;

namespace InventoryService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<InventoryItem> InventoryItems { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
