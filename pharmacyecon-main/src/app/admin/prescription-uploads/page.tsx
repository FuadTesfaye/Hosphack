'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Eye, Check, X, Clock, CheckCircle, XCircle, User, Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PrescriptionUpload {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  notes: string;
  pharmacyId: string;
  pharmacyName: string;
  files: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  uploadDate: string;
}

export default function PrescriptionUploadsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionUpload | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (prescriptionId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prescriptionId, status })
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      await loadPrescriptions();
      
      const action = status === 'APPROVED' ? 'approved' : 'rejected';
      alert(`Prescription ${action} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const viewDetails = (prescription: PrescriptionUpload) => {
    setSelectedPrescription(prescription);
    setDetailsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalPrescriptions = prescriptions.length;
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'PENDING_REVIEW').length;
  const approvedPrescriptions = prescriptions.filter(p => p.status === 'APPROVED').length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Prescription Uploads
              </h1>
              <p className="text-blue-100 text-lg">Review customer prescription submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                <p className="text-3xl font-bold text-gray-900">{totalPrescriptions}</p>
                <p className="text-sm font-medium text-blue-600">All submissions</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{pendingPrescriptions}</p>
                <p className="text-sm font-medium text-orange-600">Awaiting action</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedPrescriptions}</p>
                <p className="text-sm font-medium text-green-600">Ready for processing</p>
              </div>
              <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescriptions Table */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Prescription Submissions ({prescriptions.length})</h2>
          </div>
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Patient</TableHead>
                  <TableHead className="font-semibold">Pharmacy</TableHead>
                  <TableHead className="font-semibold">Upload Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">{prescription.patientName}</p>
                        <p className="text-sm text-gray-600">{prescription.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{prescription.pharmacyName}</TableCell>
                    <TableCell>{new Date(prescription.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          prescription.status === 'APPROVED' ? 'default' : 
                          prescription.status === 'REJECTED' ? 'destructive' : 'secondary'
                        }
                        className={`flex items-center gap-1 w-fit ${
                          prescription.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                          prescription.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {getStatusIcon(prescription.status)}
                        {prescription.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewDetails(prescription)}
                          className="hover:bg-blue-50 border-blue-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {prescription.status === 'PENDING_REVIEW' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusUpdate(prescription.id, 'APPROVED')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(prescription.id, 'REJECTED')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {prescriptions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No prescription uploads found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Patient:</span>
                    <span>{selectedPrescription.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedPrescription.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span>{selectedPrescription.phone}</span>
                  </div>
                </div>
                <div>
                  <p><span className="font-medium">Pharmacy:</span> {selectedPrescription.pharmacyName}</p>
                  <p><span className="font-medium">Upload Date:</span> {new Date(selectedPrescription.uploadDate).toLocaleString()}</p>
                </div>
              </div>
              {selectedPrescription.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{selectedPrescription.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}