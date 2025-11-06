using Microsoft.EntityFrameworkCore;
using MedicalRecordService.Application.Interfaces;
using MedicalRecordService.Domain.Entities;

namespace MedicalRecordService.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Patient> Patients => Set<Patient>();
}
