# Hospital EMR Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Code/Solutions/*.sln ./
COPY Code/Solutions/global.json ./
COPY Code/Components/ ./Components/
COPY Code/Websites/ ./Websites/

# Restore dependencies
RUN dotnet restore "DanpheEMR.sln"

# Build the application
WORKDIR "/src"
RUN dotnet build "DanpheEMR.sln" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Websites/DanpheEMR/DanpheEMR.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app

# Install SQL Server tools for health checks
RUN apt-get update && apt-get install -y curl

# Copy published application
COPY --from=publish /app/publish .

# Copy database scripts
COPY Database/ ./Database/

# Create non-root user
RUN groupadd -r danphe && useradd -r -g danphe danphe
RUN chown -R danphe:danphe /app
USER danphe

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

ENTRYPOINT ["dotnet", "DanpheEMR.dll"]