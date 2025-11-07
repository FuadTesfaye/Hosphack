using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorService.Application.Interfaces;
using DoctorService.Domain.Entities;

namespace DoctorService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public DoctorsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
    {
        return await _context.Doctors.Where(d => d.IsActive).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Doctor>> GetDoctor(Guid id)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
        {
            return NotFound();
        }

        return doctor;
    }

    [HttpPost]
    public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
    {
        doctor.Id = Guid.NewGuid();
        doctor.JoinDate = DateTime.Now;
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDoctor(Guid id, Doctor doctor)
    {
        if (id != doctor.Id)
        {
            return BadRequest();
        }

        _context.Doctors.Update(doctor);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DoctorExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(Guid id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null)
        {
            return NotFound();
        }

        doctor.IsActive = false; // Soft delete
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Doctor>>> SearchDoctors([FromQuery] string? name, [FromQuery] string? specialization, [FromQuery] string? department)
    {
        var query = _context.Doctors.Where(d => d.IsActive).AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(d => d.FirstName.Contains(name) || d.LastName.Contains(name));
        }

        if (!string.IsNullOrEmpty(specialization))
        {
            query = query.Where(d => d.Specialization.Contains(specialization));
        }

        if (!string.IsNullOrEmpty(department))
        {
            query = query.Where(d => d.Department.Contains(department));
        }

        return await query.OrderBy(d => d.LastName).ToListAsync();
    }

    [HttpGet("specialization/{specialization}")]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsBySpecialization(string specialization)
    {
        return await _context.Doctors
            .Where(d => d.IsActive && d.Specialization.Contains(specialization))
            .OrderBy(d => d.LastName)
            .ToListAsync();
    }

    [HttpGet("department/{department}")]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsByDepartment(string department)
    {
        return await _context.Doctors
            .Where(d => d.IsActive && d.Department.Contains(department))
            .OrderBy(d => d.LastName)
            .ToListAsync();
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetDoctorStatistics()
    {
        var totalDoctors = await _context.Doctors.CountAsync(d => d.IsActive);
        var departmentStats = await _context.Doctors
            .Where(d => d.IsActive)
            .GroupBy(d => d.Department)
            .Select(g => new { Department = g.Key, Count = g.Count() })
            .ToListAsync();

        var specializationStats = await _context.Doctors
            .Where(d => d.IsActive)
            .GroupBy(d => d.Specialization)
            .Select(g => new { Specialization = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToListAsync();

        var averageExperience = await _context.Doctors
            .Where(d => d.IsActive)
            .AverageAsync(d => d.ExperienceYears);

        return Ok(new
        {
            TotalDoctors = totalDoctors,
            DepartmentDistribution = departmentStats,
            TopSpecializations = specializationStats,
            AverageExperience = Math.Round(averageExperience, 1)
        });
    }

    private bool DoctorExists(Guid id)
    {
        return _context.Doctors.Any(e => e.Id == id);
    }
}