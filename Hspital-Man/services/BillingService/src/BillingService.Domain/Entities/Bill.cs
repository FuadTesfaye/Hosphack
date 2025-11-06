namespace BillingService.Domain.Entities;

public class Bill
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public decimal Amount { get; set; }
    public DateTime BillingDate { get; set; }
    public bool IsPaid { get; set; }
}
