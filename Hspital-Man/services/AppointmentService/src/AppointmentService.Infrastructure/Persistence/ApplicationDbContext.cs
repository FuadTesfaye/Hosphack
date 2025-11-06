using Microsoft.EntityFrameworkCore;
using AppointmentService.Application.Interfaces;
using AppointmentService.Domain.Entities;

namespace AppointmentService.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Patient> Patients => Set<Patient>();
}
