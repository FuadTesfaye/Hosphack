using Microsoft.EntityFrameworkCore;
using MedicalRecordService.Domain.Entities;

namespace MedicalRecordService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<MedicalRecord> MedicalRecords { get; }
    DbSet<Patient> Patients { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
