using Microsoft.EntityFrameworkCore;
using AppointmentService.Domain.Entities;

namespace AppointmentService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Appointment> Appointments { get; }
    DbSet<Patient> Patients { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
