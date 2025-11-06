using Microsoft.EntityFrameworkCore;
using PatientService.Domain.Entities;

namespace PatientService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Patient> Patients { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
