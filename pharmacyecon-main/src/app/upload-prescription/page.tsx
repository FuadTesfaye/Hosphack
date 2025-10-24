'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Camera, 
  Check, 
  X, 
  Shield, 
  Clock,
  Sparkles,
  Heart,
  Award,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Pill,
  Stethoscope,
  Store,
  MapPin,
  Star
} from 'lucide-react';
import Image from 'next/image';
import { getPharmacies } from '@/lib/api';
import type { Pharmacy } from '@/lib/types';


export default function UploadPrescriptionPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [showPharmacySelection, setShowPharmacySelection] = useState(false);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    setLoadingPharmacies(true);
    try {
      const pharmaciesData = await getPharmacies();
      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setLoadingPharmacies(false);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const acceptedFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    
    // Create previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPharmacy) {
      setShowPharmacySelection(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const prescriptionData = {
        ...formData,
        pharmacyId: selectedPharmacy.id,
        pharmacyName: selectedPharmacy.name,
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        uploadDate: new Date().toISOString(),
        status: 'pending'
      };
      
      // Send to API
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onDrop([file]);
      }
    };
    input.click();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm animate-fade-in-up">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Prescription Uploaded Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your prescription has been sent to <strong>{selectedPharmacy?.name}</strong> and will be reviewed within 24 hours.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFiles([]);
                setPreviews([]);
                setFormData({ patientName: '', email: '', phone: '', notes: '' });
                setSelectedPharmacy(null);
                setShowPharmacySelection(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300"
            >
              Upload Another Prescription
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center transform transition-all duration-1000 animate-fade-in-up">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 animate-pulse">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Confidential
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Upload Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Prescription
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Securely upload your prescription and get your medicines delivered to your doorstep.
            </p>

            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24hr Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Licensed Pharmacists</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/90 backdrop-blur-sm transform transition-all duration-700 animate-fade-in-up">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                Upload Prescription Files
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Upload clear images or PDF files of your prescription
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
                className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <input 
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      dragActive 
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 animate-pulse' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {dragActive ? 'Drop files here!' : 'Drag & drop your prescription files'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or click to browse from your device
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, PDF (Max 10MB per file)
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCameraCapture();
                      }}
                      className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Use Camera
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('file-input')?.click();
                      }}
                      className="hover:bg-green-50 hover:border-green-300 transition-all duration-300 group"
                    >
                      <ImageIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>

              {/* File Previews */}
              {files.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Uploaded Files ({files.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <Card key={index} className="group border-2 border-green-200 bg-green-50/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-4">
                          <div className="relative">
                            {file.type.startsWith('image/') ? (
                              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                <Image
                                  src={previews[index]}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                <FileText className="w-12 h-12 text-red-600" />
                              </div>
                            )}
                            
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pharmacy Selection */}
          {(files.length > 0 || showPharmacySelection) && (
            <Card className="mb-8 border-0 shadow-2xl bg-white/90 backdrop-blur-sm transform transition-all duration-700 delay-200 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
                  <Store className="w-8 h-8 text-blue-500" />
                  Select Pharmacy
                </CardTitle>
                <p className="text-gray-600">Choose your preferred pharmacy for prescription processing</p>
              </CardHeader>
              <CardContent className="p-8">
                {loadingPharmacies ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pharmacies.map((pharmacy) => (
                      <Card 
                        key={pharmacy.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                          selectedPharmacy?.id === pharmacy.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                            : 'hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPharmacy(pharmacy)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={pharmacy.logoUrl}
                                alt={pharmacy.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{pharmacy.name}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-600 truncate">{pharmacy.address}</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                                <span className="text-xs text-gray-600">{pharmacy.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            {selectedPharmacy?.id === pharmacy.id && (
                              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {selectedPharmacy && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Selected: {selectedPharmacy.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Patient Information */}
          <Card className="mb-8 border-0 shadow-2xl bg-white/90 backdrop-blur-sm transform transition-all duration-700 delay-300 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-green-500" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-sm font-semibold text-gray-700">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient's full name"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Prescription Type
                  </Label>
                  <div className="flex gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Pill className="w-3 h-3 mr-1" />
                      Regular
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Controlled
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or notes for the pharmacist..."
                  className="min-h-24 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-md resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 transform transition-all duration-700 delay-500 animate-fade-in-up">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Your Privacy is Protected</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All prescription uploads are encrypted and stored securely. We comply with HIPAA regulations 
                    and your personal health information is never shared without your consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center transform transition-all duration-700 delay-700 animate-fade-in-up">
            <Button
              type="submit"
              size="lg"
              disabled={files.length === 0 || isSubmitting || !selectedPharmacy}
              className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Uploading Prescription...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-3" />
                  Submit Prescription
                </>
              )}
            </Button>
            
            {(files.length === 0 || !selectedPharmacy) && (
              <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {files.length === 0 
                  ? 'Please upload at least one prescription file to continue'
                  : 'Please select a pharmacy to continue'
                }
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}