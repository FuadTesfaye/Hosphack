using MassTransit;
using System.Threading.Tasks;
using MedicalRecordService.Application.Interfaces;
using MedicalRecordService.Domain.Entities;
using MedicalRecordService.Domain.Events;

namespace MedicalRecordService.Application.Consumers;

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
