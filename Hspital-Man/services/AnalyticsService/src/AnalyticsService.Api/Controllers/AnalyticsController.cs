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

    [HttpGet("patients/count")]
    public async Task<ActionResult<int>> GetPatientsCount()
    {
        return await _context.Patients.CountAsync();
    }
}
