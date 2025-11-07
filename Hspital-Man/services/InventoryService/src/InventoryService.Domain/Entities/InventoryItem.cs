namespace InventoryService.Domain.Entities;

public class InventoryItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty; // Medicine, Equipment, Supplies, etc.
    public string? Description { get; set; }
    public string? Supplier { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? BatchNumber { get; set; }
    public int MinimumStock { get; set; } = 10;
    public int MaximumStock { get; set; } = 1000;
    public string Unit { get; set; } = "pcs"; // pcs, mg, ml, kg, etc.
    public string? Location { get; set; } // Storage location
    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public DateTime? LastUpdated { get; set; }
}
