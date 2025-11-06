using MassTransit;
using System.Threading.Tasks;
using BillingService.Application.Interfaces;
using BillingService.Domain.Entities;
using BillingService.Domain.Events;

namespace BillingService.Application.Consumers;

public class PatientCreatedConsumer : IConsumer<PatientCreated>
{
    private readonly IApplicationDbContext _context;

    public PatientCreatedConsumer(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Consume(ConsumeContext<PatientCreated> context)
    {
        var patient = new Patient
        {
            Id = context.Message.Id,
            FirstName = context.Message.FirstName,
            LastName = context.Message.LastName
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync(context.CancellationToken);
    }
}
