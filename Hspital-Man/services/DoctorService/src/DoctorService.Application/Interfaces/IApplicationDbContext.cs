using Microsoft.EntityFrameworkCore;
using DoctorService.Domain.Entities;

namespace DoctorService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Doctor> Doctors { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}