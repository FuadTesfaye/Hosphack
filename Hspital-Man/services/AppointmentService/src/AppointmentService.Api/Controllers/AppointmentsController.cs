using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentService.Application.Interfaces;
using AppointmentService.Domain.Entities;

namespace AppointmentService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AppointmentsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Appointment>> GetAppointment(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        return appointment;
    }

    [HttpPost]
    public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(CancellationToken.None);

        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAppointment(Guid id, Appointment appointment)
    {
        if (id != appointment.Id)
        {
            return BadRequest();
        }

        _context.Appointments.Update(appointment);

        try
        {
            await _context.SaveChangesAsync(CancellationToken.None);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AppointmentExists(id))
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
    public async Task<IActionResult> DeleteAppointment(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound();
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync(CancellationToken.None);

        return NoContent();
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByPatient(Guid patientId)
    {
        return await _context.Appointments
            .Where(a => a.PatientId == patientId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDoctor(Guid doctorId)
    {
        return await _context.Appointments
            .Where(a => a.DoctorId == doctorId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    [HttpGet("date/{date}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDate(DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.AppointmentDate.Date == date.Date)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(Guid id, [FromBody] string status)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound();
        }

        var validStatuses = new[] { "Scheduled", "Confirmed", "InProgress", "Completed", "Cancelled", "NoShow" };
        if (!validStatuses.Contains(status))
        {
            return BadRequest("Invalid status");
        }

        appointment.Status = status;
        if (status == "Completed")
        {
            appointment.CompletedDate = DateTime.Now;
        }

        await _context.SaveChangesAsync(CancellationToken.None);
        return NoContent();
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetUpcomingAppointments()
    {
        return await _context.Appointments
            .Where(a => a.AppointmentDate > DateTime.Now)
            .OrderBy(a => a.AppointmentDate)
            .Take(10)
            .ToListAsync();
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetAppointmentStatistics()
    {
        var today = DateTime.Today;
        var todayAppointments = await _context.Appointments
            .CountAsync(a => a.AppointmentDate.Date == today);
        
        var thisWeekAppointments = await _context.Appointments
            .CountAsync(a => a.AppointmentDate.Date >= today && a.AppointmentDate.Date <= today.AddDays(7));
        
        var totalAppointments = await _context.Appointments.CountAsync();

        return Ok(new
        {
            TodayAppointments = todayAppointments,
            ThisWeekAppointments = thisWeekAppointments,
            TotalAppointments = totalAppointments
        });
    }

    private bool AppointmentExists(Guid id)
    {
        return _context.Appointments.Any(e => e.Id == id);
    }
}
