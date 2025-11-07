import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Mail, Phone, Calendar, User } from 'lucide-react';
import { patientApi } from '@/lib/api';
import { usePatientStore } from '@/stores/patientStore';

export default function Patients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { patients, setPatients } = usePatientStore();

  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientApi.getAll(),
  });

  useEffect(() => {
    if (data?.data) {
      setPatients(data.data);
    }
  }, [data, setPatients]);

  const displayedPatients = searchQuery
    ? patients.filter((patient: any) =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Patients
          </h2>
          <p className="text-muted-foreground">Manage and view all patient records</p>
        </div>
        <Button onClick={() => navigate('/patients/register')} className="gap-2">
          <Plus className="h-4 w-4" />
          Register Patient
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedPatients.map((patient: any) => (
          <Card key={patient.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {patient.firstName} {patient.lastName}
                    </CardTitle>
                    <CardDescription>ID: {patient.id}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )))}
        </div>
      )}

      {displayedPatients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Register your first patient to get started'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
