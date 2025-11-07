namespace AppointmentService.Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Confirmed, InProgress, Completed, Cancelled, NoShow
    public int DurationMinutes { get; set; } = 30;
    public string? Notes { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public DateTime? CompletedDate { get; set; }
    public string AppointmentType { get; set; } = "Consultation"; // Consultation, FollowUp, Emergency, Surgery
    public decimal? Fee { get; set; }
}
