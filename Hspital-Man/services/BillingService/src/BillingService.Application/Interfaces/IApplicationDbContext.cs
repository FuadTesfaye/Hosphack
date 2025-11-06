using Microsoft.EntityFrameworkCore;
using BillingService.Domain.Entities;

namespace BillingService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Bill> Bills { get; }
    DbSet<Patient> Patients { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
