'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera } from 'lucide-react';
import Image from 'next/image';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import type { Medicine } from '@/lib/types';

interface LicenseUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  medicine: Medicine;
  onSuccess: () => void;
}

export function LicenseUploadDialog({ isOpen, onOpenChange, medicine, onSuccess }: LicenseUploadDialogProps) {
  const [email, setEmail] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLicensePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        setLicenseFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setLicensePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeLicense = () => {
    setLicenseFile(null);
    setLicensePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !licenseFile) return;

    setUploading(true);
    try {
      // For demo: convert image to base64 (replace with proper storage later)
      const reader = new FileReader();
      const licenseImageUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(licenseFile);
      });

      console.log('🔄 Submitting license request:', {
        medicineId: medicine.id,
        medicineName: medicine.name,
        customerEmail: email,
        pharmacyId: medicine.pharmacyId
      });

      // Save license request via API
      const response = await fetch('/api/license-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: medicine.id,
          medicineName: medicine.name,
          customerEmail: email,
          licenseImageUrl,
          status: 'pending',
          pharmacyId: medicine.pharmacyId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to submit license request');
      }

      const result = await response.json();
      console.log('✅ License request submitted successfully:', result);

      alert('License uploaded successfully! You will be notified once it is reviewed. You cannot add this item to cart until approved.');
      onSuccess();
      onOpenChange(false);
      setEmail('');
      setLicenseFile(null);
      setLicensePreview('');
    } catch (error) {
      console.error('Error uploading license:', error);
      alert(`Failed to upload license: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Prescription License</DialogTitle>
            <DialogDescription>
              This medicine requires a prescription license. Please upload your prescription to proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="medicine">Medicine</Label>
              <Input value={medicine.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Prescription License</Label>
              {licensePreview ? (
                <div className="relative">
                  <Image
                    src={licensePreview}
                    alt="License preview"
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={removeLicense}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload prescription image</p>
                  <div className="flex gap-2 justify-center">
                    <Button type="button" variant="outline" onClick={handleCameraCapture}>
                      <Camera className="mr-2 h-4 w-4" />
                      Camera
                    </Button>
                    <Button type="button" variant="outline" onClick={() => document.getElementById('license-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      File
                    </Button>
                  </div>
                </div>
              )}
              <Input
                id="license-upload"
                type="file"
                accept="image/*"
                onChange={handleLicenseChange}
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!email || !licenseFile || uploading}>
              {uploading ? 'Uploading...' : 'Submit License'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}