namespace DoctorService.Domain.Entities;

public class Doctor
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Department { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public string Qualifications { get; set; } = string.Empty;
    public int ExperienceYears { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime JoinDate { get; set; }
}