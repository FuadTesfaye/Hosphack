import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { usePatientStore } from '@/stores/patientStore';

const recordSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  treatment: z.string().min(1, 'Treatment is required'),
  notes: z.string().optional(),
  visitDate: z.string().min(1, 'Visit date is required'),
});

type RecordFormData = z.infer<typeof recordSchema>;

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const isNew = id === 'new';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      visitDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: RecordFormData) => {
    // Here you would save to your backend/store
    console.log('Saving record:', data);
    toast({
      title: 'Success',
      description: `Medical record ${isNew ? 'created' : 'updated'} successfully`,
    });
    navigate('/records');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/records')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            {isNew ? 'New Medical Record' : 'Edit Medical Record'}
          </h2>
          <p className="text-muted-foreground">Enter patient medical record details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
            <CardDescription>Fill in the medical record details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <select
                  id="patientId"
                  {...register('patientId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-sm text-destructive">{errors.patientId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  {...register('doctorName')}
                  placeholder="Dr. John Smith"
                />
                {errors.doctorName && (
                  <p className="text-sm text-destructive">{errors.doctorName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input
                  id="visitDate"
                  type="date"
                  {...register('visitDate')}
                />
                {errors.visitDate && (
                  <p className="text-sm text-destructive">{errors.visitDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                {...register('diagnosis')}
                placeholder="Enter diagnosis details"
                rows={3}
              />
              {errors.diagnosis && (
                <p className="text-sm text-destructive">{errors.diagnosis.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea
                id="treatment"
                {...register('treatment')}
                placeholder="Enter treatment plan"
                rows={3}
              />
              {errors.treatment && (
                <p className="text-sm text-destructive">{errors.treatment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {isNew ? 'Create Record' : 'Update Record'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/records')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
