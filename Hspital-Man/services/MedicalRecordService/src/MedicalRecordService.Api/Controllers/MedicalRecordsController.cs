using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalRecordService.Application.Interfaces;
using MedicalRecordService.Domain.Entities;

namespace MedicalRecordService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalRecordsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public MedicalRecordsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecords()
    {
        return await _context.MedicalRecords.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalRecord>> GetMedicalRecord(Guid id)
    {
        var medicalRecord = await _context.MedicalRecords.FindAsync(id);

        if (medicalRecord == null)
        {
            return NotFound();
        }

        return medicalRecord;
    }

    [HttpPost]
    public async Task<ActionResult<MedicalRecord>> PostMedicalRecord(MedicalRecord medicalRecord)
    {
        _context.MedicalRecords.Add(medicalRecord);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetMedicalRecord), new { id = medicalRecord.Id }, medicalRecord);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutMedicalRecord(Guid id, MedicalRecord medicalRecord)
    {
        if (id != medicalRecord.Id)
        {
            return BadRequest();
        }

        _context.MedicalRecords.Update(medicalRecord);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MedicalRecordExists(id))
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
    public async Task<IActionResult> DeleteMedicalRecord(Guid id)
    {
        var medicalRecord = await _context.MedicalRecords.FindAsync(id);
        if (medicalRecord == null)
        {
            return NotFound();
        }

        _context.MedicalRecords.Remove(medicalRecord);
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByPatient(Guid patientId)
    {
        return await _context.MedicalRecords
            .Where(mr => mr.PatientId == patientId)
            .OrderByDescending(mr => mr.VisitDate)
            .ToListAsync();
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByDoctor(Guid doctorId)
    {
        return await _context.MedicalRecords
            .Where(mr => mr.DoctorId == doctorId)
            .OrderByDescending(mr => mr.VisitDate)
            .ToListAsync();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> SearchMedicalRecords([FromQuery] string? diagnosis, [FromQuery] string? treatment)
    {
        var query = _context.MedicalRecords.AsQueryable();

        if (!string.IsNullOrEmpty(diagnosis))
        {
            query = query.Where(mr => mr.Diagnosis.Contains(diagnosis));
        }

        if (!string.IsNullOrEmpty(treatment))
        {
            query = query.Where(mr => mr.Treatment.Contains(treatment));
        }

        return await query.OrderByDescending(mr => mr.VisitDate).ToListAsync();
    }

    [HttpGet("patient/{patientId}/latest")]
    public async Task<ActionResult<MedicalRecord>> GetLatestMedicalRecord(Guid patientId)
    {
        var latestRecord = await _context.MedicalRecords
            .Where(mr => mr.PatientId == patientId)
            .OrderByDescending(mr => mr.VisitDate)
            .FirstOrDefaultAsync();

        if (latestRecord == null)
        {
            return NotFound();
        }

        return latestRecord;
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetMedicalRecordStatistics()
    {
        var totalRecords = await _context.MedicalRecords.CountAsync();
        var recordsThisMonth = await _context.MedicalRecords
            .CountAsync(mr => mr.VisitDate.Month == DateTime.Now.Month && mr.VisitDate.Year == DateTime.Now.Year);
        
        var commonDiagnoses = await _context.MedicalRecords
            .GroupBy(mr => mr.Diagnosis)
            .Select(g => new { Diagnosis = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToListAsync();

        return Ok(new
        {
            TotalRecords = totalRecords,
            RecordsThisMonth = recordsThisMonth,
            CommonDiagnoses = commonDiagnoses
        });
    }

    private bool MedicalRecordExists(Guid id)
    {
        return _context.MedicalRecords.Any(e => e.Id == id);
    }
}
