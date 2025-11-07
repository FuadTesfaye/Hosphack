using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatientService.Application.Interfaces;
using PatientService.Domain.Entities;
using PatientService.Domain.Events;

namespace PatientService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IPublishEndpoint _publishEndpoint;

    public PatientsController(IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
    {
        return await _context.Patients.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);

        if (patient == null)
        {
            return NotFound();
        }

        return patient;
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> PostPatient(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync(CancellationToken.None);

        await _publishEndpoint.Publish(new PatientCreated
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName
        });

        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPatient(Guid id, Patient patient)
    {
        if (id != patient.Id)
        {
            return BadRequest();
        }

        _context.Patients.Update(patient);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PatientExists(id))
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
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
        {
            return NotFound();
        }

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Patient>>> SearchPatients([FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? phone)
    {
        var query = _context.Patients.AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(p => p.FirstName.Contains(name) || p.LastName.Contains(name));
        }

        if (!string.IsNullOrEmpty(email))
        {
            query = query.Where(p => p.Email.Contains(email));
        }

        if (!string.IsNullOrEmpty(phone))
        {
            query = query.Where(p => p.Phone.Contains(phone));
        }

        return await query.ToListAsync();
    }

    [HttpGet("{id}/medical-history")]
    public async Task<ActionResult<object>> GetPatientMedicalHistory(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            PatientId = id,
            Allergies = patient.Allergies,
            ChronicConditions = patient.ChronicConditions,
            BloodGroup = patient.BloodGroup,
            EmergencyContact = patient.EmergencyContact,
            EmergencyPhone = patient.EmergencyPhone
        });
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetPatientStatistics()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var patientsThisMonth = await _context.Patients
            .CountAsync(p => p.DateOfBirth.Month == DateTime.Now.Month);
        
        var genderStats = await _context.Patients
            .GroupBy(p => p.Gender)
            .Select(g => new { Gender = g.Key, Count = g.Count() })
            .ToListAsync();

        return Ok(new
        {
            TotalPatients = totalPatients,
            PatientsThisMonth = patientsThisMonth,
            GenderDistribution = genderStats
        });
    }

    private bool PatientExists(Guid id)
    {
        return _context.Patients.Any(e => e.Id == id);
    }
}
