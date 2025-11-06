import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patientStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, User, Heart, FileText, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = usePatientStore((state) => state.getPatient(id || ''));

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-4">The patient you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/patients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
        <Button>Edit Patient</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <CardDescription>
              {patient.gender} • {calculateAge(patient.dateOfBirth)} years old
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.bloodGroup && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blood Group</span>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  {patient.bloodGroup}
                </Badge>
              </div>
            )}
            <div className="flex items-start gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary mt-0.5" />
              <span className="break-all">{patient.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span>{patient.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Emergency Contact
                  </h3>
                  <div className="rounded-lg border border-border p-4 space-y-2">
                    <p className="font-medium">{patient.emergencyContact}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {patient.emergencyPhone}
                    </p>
                  </div>
                </div>

                {patient.insuranceProvider && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Insurance Information
                    </h3>
                    <div className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="font-medium">{patient.insuranceProvider}</span>
                      </div>
                      {patient.insuranceNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Policy Number</span>
                          <span className="font-medium">{patient.insuranceNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Registration Details</h3>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Registration Date</span>
                      <span className="font-medium">
                        {new Date(patient.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    Allergies
                  </h3>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm">
                      {patient.allergies || 'No known allergies'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-warning" />
                    Chronic Conditions
                  </h3>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm">
                      {patient.chronicConditions || 'No chronic conditions recorded'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Medical History</h3>
                  <div className="rounded-lg border border-border p-4 text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No medical history available</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No appointments scheduled</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Schedule Appointment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4">
                <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No billing records found</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Create Invoice
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
