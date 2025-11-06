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

    private bool MedicalRecordExists(Guid id)
    {
        return _context.MedicalRecords.Any(e => e.Id == id);
    }
}
