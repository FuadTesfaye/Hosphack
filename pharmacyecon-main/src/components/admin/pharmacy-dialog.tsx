
'use client';

import { useState, useEffect } from 'react';
import type { Pharmacy } from '@/lib/types';
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
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface PharmacyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (pharmacy: Omit<Pharmacy, 'id'>, id?: string, logoFile?: File, licenseFile?: File) => void;
  pharmacy: Pharmacy | null;
}

export function PharmacyDialog({ isOpen, onOpenChange, onSave, pharmacy }: PharmacyDialogProps) {
  const [formData, setFormData] = useState<Omit<Pharmacy, 'id' | 'logoUrl' | 'licenseUrl'>>({
    name: '',
    address: '',
    phone: '',
    rating: 0,
    email: '',
    password: '',
    permissions: '',
  });
  
  const availablePages = [
    { id: 'medicines', name: 'Medicines Management' },
    { id: 'orders', name: 'Orders Management' },
    { id: 'prescriptions', name: 'Prescriptions Management' },
    { id: 'licenses', name: 'License Requests Management' },
    { id: 'dashboard', name: 'Dashboard Analytics' }
  ];
  
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string>('');

  useEffect(() => {
    if (pharmacy) {
      setFormData({
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        rating: pharmacy.rating,
        email: pharmacy.email || '',
        password: pharmacy.password || '', // Show existing password when editing
        permissions: pharmacy.permissions || '',
      });
      setSelectedPages(pharmacy.permissions ? pharmacy.permissions.split(',') : []);
      setLogoPreview(pharmacy.logoUrl);
      setLicensePreview(pharmacy.licenseUrl);
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        rating: 0,
        email: '',
        password: '',
        permissions: '',
      });
      setSelectedPages([]);
      setLogoPreview('');
      setLicensePreview('');
    }
    setLogoFile(null);
    setLicenseFile(null);
  }, [pharmacy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLicensePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLicense = () => {
    setLicenseFile(null);
    setLicensePreview('');
  };

  const handlePageToggle = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pharmacyData = {
        ...formData,
        logoUrl: logoPreview || 'https://picsum.photos/100/100',
        licenseUrl: licensePreview || '',
        permissions: selectedPages.join(','),
    };
    onSave(pharmacyData, pharmacy?.id, logoFile, licenseFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{pharmacy ? 'Edit Pharmacy' : 'Add Pharmacy'}</DialogTitle>
            <DialogDescription>
              {pharmacy ? 'Make changes to the pharmacy details.' : 'Add a new pharmacy to your network.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">Rating</Label>
              <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Logo</Label>
              <div className="col-span-3 space-y-2">
                {logoPreview ? (
                  <div className="relative">
                    <Image
                      src={logoPreview}
                      alt="Pharmacy logo preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={removeLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No logo selected</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="text" 
                value={formData.password} 
                onChange={handleChange} 
                className="col-span-3" 
                placeholder={pharmacy ? 'Current password will be shown' : 'Enter password'}
                required 
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Allowed Pages</Label>
              <div className="col-span-3 space-y-2">
                {availablePages.map((page) => (
                  <div key={page.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={page.id}
                      checked={selectedPages.includes(page.id)}
                      onChange={() => handlePageToggle(page.id)}
                      className="rounded"
                    />
                    <Label htmlFor={page.id} className="text-sm font-normal">
                      {page.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">License</Label>
              <div className="col-span-3 space-y-2">
                {licensePreview ? (
                  <div className="relative">
                    <Image
                      src={licensePreview}
                      alt="License preview"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
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
                    <p className="text-sm text-gray-500">No license selected</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleLicenseChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
