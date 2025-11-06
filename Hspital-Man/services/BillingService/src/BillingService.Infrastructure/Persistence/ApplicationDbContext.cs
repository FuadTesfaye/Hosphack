using Microsoft.EntityFrameworkCore;
using BillingService.Application.Interfaces;
using BillingService.Domain.Entities;

namespace BillingService.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Bill> Bills => Set<Bill>();
    public DbSet<Patient> Patients => Set<Patient>();
}
