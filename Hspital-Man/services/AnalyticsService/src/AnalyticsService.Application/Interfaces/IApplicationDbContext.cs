using Microsoft.EntityFrameworkCore;
using AnalyticsService.Domain.Entities;

namespace AnalyticsService.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Patient> Patients { get; }
}
