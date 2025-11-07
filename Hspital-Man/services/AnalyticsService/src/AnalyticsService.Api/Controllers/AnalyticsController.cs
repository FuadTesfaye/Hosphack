using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnalyticsService.Application.Interfaces;

namespace AnalyticsService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AnalyticsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<object>> GetDashboardMetrics()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var newPatientsThisMonth = await _context.Patients
            .CountAsync(p => p.Id != Guid.Empty); // Placeholder - would need CreatedDate field
        
        return Ok(new
        {
            TotalPatients = totalPatients,
            NewPatientsThisMonth = newPatientsThisMonth,
            TotalAppointments = 0, // Would need to call other services
            TotalRevenue = 0m // Would need to call billing service
        });
    }

    [HttpGet("patients/count")]
    public async Task<ActionResult<int>> GetPatientsCount()
    {
        return await _context.Patients.CountAsync();
    }

    [HttpGet("patients/demographics")]
    public async Task<ActionResult<object>> GetPatientDemographics()
    {
        var genderDistribution = await _context.Patients
            .GroupBy(p => p.Gender)
            .Select(g => new { Gender = g.Key, Count = g.Count() })
            .ToListAsync();

        var ageGroups = await _context.Patients
            .Select(p => new { Age = DateTime.Now.Year - p.DateOfBirth.Year })
            .ToListAsync();

        var ageDistribution = ageGroups
            .GroupBy(p => p.Age < 18 ? "Child" : p.Age < 65 ? "Adult" : "Senior")
            .Select(g => new { AgeGroup = g.Key, Count = g.Count() })
            .ToList();

        return Ok(new
        {
            GenderDistribution = genderDistribution,
            AgeDistribution = ageDistribution
        });
    }

    [HttpGet("patients/growth")]
    public async Task<ActionResult<object>> GetPatientGrowth([FromQuery] int months = 12)
    {
        // This would ideally use a CreatedDate field on Patient entity
        var monthlyGrowth = new List<object>();
        
        for (int i = months - 1; i >= 0; i--)
        {
            var date = DateTime.Now.AddMonths(-i);
            monthlyGrowth.Add(new
            {
                Month = date.ToString("MMM yyyy"),
                Count = await _context.Patients.CountAsync() // Placeholder
            });
        }

        return Ok(monthlyGrowth);
    }

    [HttpGet("patients/blood-groups")]
    public async Task<ActionResult<object>> GetBloodGroupDistribution()
    {
        var bloodGroups = await _context.Patients
            .Where(p => !string.IsNullOrEmpty(p.BloodGroup))
            .GroupBy(p => p.BloodGroup)
            .Select(g => new { BloodGroup = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return Ok(bloodGroups);
    }

    [HttpGet("patients/insurance")]
    public async Task<ActionResult<object>> GetInsuranceStatistics()
    {
        var insuredPatients = await _context.Patients
            .CountAsync(p => !string.IsNullOrEmpty(p.InsuranceProvider));
        
        var totalPatients = await _context.Patients.CountAsync();
        var uninsuredPatients = totalPatients - insuredPatients;

        var insuranceProviders = await _context.Patients
            .Where(p => !string.IsNullOrEmpty(p.InsuranceProvider))
            .GroupBy(p => p.InsuranceProvider)
            .Select(g => new { Provider = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToListAsync();

        return Ok(new
        {
            InsuredPatients = insuredPatients,
            UninsuredPatients = uninsuredPatients,
            InsuranceRate = totalPatients > 0 ? (double)insuredPatients / totalPatients * 100 : 0,
            TopInsuranceProviders = insuranceProviders
        });
    }

    [HttpGet("health")]
    public async Task<ActionResult<object>> GetHealthCheck()
    {
        return Ok(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Service = "Analytics Service",
            Version = "1.0.0"
        });
    }
}
