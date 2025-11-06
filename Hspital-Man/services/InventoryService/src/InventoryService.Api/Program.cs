using Microsoft.EntityFrameworkCore;
using InventoryService.Application.Interfaces;
using InventoryService.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    .Replace("__DB_HOST__", Environment.GetEnvironmentVariable("DB_HOST"))
    .Replace("__DB_NAME__", Environment.GetEnvironmentVariable("DB_NAME"))
    .Replace("__DB_USER__", Environment.GetEnvironmentVariable("DB_USER"))
    .Replace("__DB_PASSWORD__", Environment.GetEnvironmentVariable("DB_PASSWORD"));

builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
