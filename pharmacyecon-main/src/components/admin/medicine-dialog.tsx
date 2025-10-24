'use client';

import { useState, useEffect } from 'react';
import type { Medicine, Pharmacy } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface MedicineDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (medicine: Omit<Medicine, 'id'>, id?: string, imageFile?: File) => void;
  medicine: Medicine | null;
  pharmacies: Pharmacy[];
}

export function MedicineDialog({ isOpen, onOpenChange, onSave, medicine, pharmacies }: MedicineDialogProps) {
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    expirationDate: '',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: '',
    category: '',
    requiresLicense: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (medicine) {
      setFormData(medicine);
      setImagePreview(medicine.imageUrl);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        expirationDate: '',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: '',
        category: '',
        requiresLicense: false,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({...prev, [name]: value,}));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: 'https://picsum.photos/400/300' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, medicine?.id, imageFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{medicine ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle>
            <DialogDescription>
              {medicine ? 'Make changes to the medicine details.' : 'Add a new medicine to the inventory.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expirationDate" className="text-right">Expiry Date</Label>
              <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requiresLicense" className="text-right">Requires License</Label>
              <div className="col-span-3">
                <input
                  type="checkbox"
                  id="requiresLicense"
                  name="requiresLicense"
                  checked={formData.requiresLicense}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresLicense: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="requiresLicense" className="ml-2 text-sm">
                  This medicine requires a prescription license to purchase
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pharmacyId" className="text-right">Pharmacy</Label>
              <Select name="pharmacyId" value={formData.pharmacyId} onValueChange={(value) => handleSelectChange('pharmacyId', value)}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                      {pharmacies.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Image</Label>
              <div className="col-span-3 space-y-2">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Medicine preview"
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
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
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
