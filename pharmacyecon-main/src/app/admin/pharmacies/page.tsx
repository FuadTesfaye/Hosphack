'use client';

import { useState, useEffect } from 'react';
import { getPharmacies, addPharmacy, updatePharmacy, deletePharmacy } from '@/lib/api';
import type { Pharmacy } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Star, Store, MapPin, Users, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { PharmacyDialog } from '@/components/admin/pharmacy-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pharmaciesData = await getPharmacies();
      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedPharmacy(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePharmacy(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
    }
  };

  const handleSave = async (pharmacyData: Omit<Pharmacy, 'id'>, id?: string, logoFile?: File, licenseFile?: File) => {
    try {
      if (id) {
        await updatePharmacy(id, pharmacyData, logoFile, licenseFile);
      } else {
        await addPharmacy(pharmacyData, logoFile, licenseFile);
      }
      await loadData();
      setIsDialogOpen(false);
      setSelectedPharmacy(null);
    } catch (error) {
      console.error('Error saving pharmacy:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalPharmacies = pharmacies.length;
  const averageRating = pharmacies.reduce((sum, p) => sum + p.rating, 0) / pharmacies.length;
  const highRatedCount = pharmacies.filter(p => p.rating >= 4.5).length;

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-gradient"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
                <Store className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent mb-2">
                  Pharmacy Network
                </h1>
                <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Manage your pharmacy partners and locations</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={async () => {
                try {
                  // Create a test pharmacy
                  const testPharmacy = {
                    name: 'Test Pharmacy',
                    address: '123 Test Street, Test City',
                    phone: '+1234567890',
                    rating: 4.5,
                    email: 'test@pharmacy.com',
                    password: 'test123',
                    permissions: 'dashboard,medicines,orders,prescriptions',
                    logoUrl: 'https://picsum.photos/100/100',
                    licenseUrl: 'https://picsum.photos/200/150'
                  };
                  
                  await handleSave(testPharmacy);
                  alert('✅ Test pharmacy created!\n\nLogin details:\nEmail: test@pharmacy.com\nPassword: test123');
                } catch (error) {
                  console.error('Error creating test pharmacy:', error);
                  alert('Failed to create test pharmacy');
                }
              }}
              variant="outline"
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-white border-yellow-300/30 backdrop-blur-sm"
            >
              🧪 Create Test Pharmacy
            </Button>
            <Button onClick={handleAddClick} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Pharmacy
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Pharmacies</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{totalPharmacies}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Active partners
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Store className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Average Rating</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{averageRating.toFixed(1)}</p>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Network quality
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">High Rated</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{highRatedCount}</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  4.5+ stars
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pharmacies Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl w-full">
        <CardContent className="p-0">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy Directory</h2>
                <p className="text-gray-600 dark:text-slate-400">Manage your network of pharmacy partners with advanced controls</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell font-semibold">
                    <span className="sr-only">Logo</span>
                  </TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Rating</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          alt={pharmacy.name}
                          className="object-cover"
                          fill
                          src={pharmacy.logoUrl}
                          unoptimized
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{pharmacy.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {pharmacy.address}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                        <span className="font-semibold">{pharmacy.rating.toFixed(1)}</span>
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                          {pharmacy.rating >= 4.5 ? 'Excellent' : pharmacy.rating >= 4.0 ? 'Good' : 'Average'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" className="hover:bg-blue-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(pharmacy)} className="hover:bg-blue-50">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive focus:text-destructive hover:bg-red-50">
                                Delete
                               </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the pharmacy from your network.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(pharmacy.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PharmacyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        pharmacy={selectedPharmacy}
      />
    </div>
  );
}