'use client';

import { useState, useEffect } from 'react';
import { getMedicines, addMedicine, updateMedicine, deleteMedicine, getPharmacies } from '@/lib/api';
import type { Medicine, Pharmacy } from '@/lib/types';
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
import { MoreHorizontal, PlusCircle, Pill, Package, TrendingUp, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { MedicineDialog } from '@/components/admin/medicine-dialog';
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

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [medicinesData, pharmaciesData] = await Promise.all([
        getMedicines(),
        getPharmacies()
      ]);
      setMedicines(medicinesData);
      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedMedicine(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicine(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleSave = async (medicineData: Omit<Medicine, 'id'>, id?: string, imageFile?: File) => {
    try {
      if (id) {
        await updateMedicine(id, medicineData, imageFile);
      } else {
        await addMedicine(medicineData, imageFile);
      }
      await loadData();
      setIsDialogOpen(false);
      setSelectedMedicine(null);
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => m.stock < 10).length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0);

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
                <Pill className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent mb-2">
                  Medicine Inventory
                </h1>
                <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Manage your pharmacy's complete medicine catalog</p>
              </div>
            </div>
          </div>
          <Button onClick={handleAddClick} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-300 px-6 py-3 text-lg">
            <PlusCircle className="mr-3 h-5 w-5" />
            Add Medicine
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Medicines</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{totalMedicines}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active inventory
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Low Stock Items</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{lowStockCount}</p>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Needs attention
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Value</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">${totalValue.toLocaleString()}</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Inventory worth
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicines Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl w-full">
        <CardContent className="p-0">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <Pill className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medicine Catalog</h2>
                <p className="text-gray-600 dark:text-slate-400">Manage your complete medicine inventory with advanced controls</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
                <TableRow className="border-b border-gray-200 dark:border-slate-600">
                  <TableHead className="hidden w-[120px] sm:table-cell font-bold text-gray-700 dark:text-slate-300 py-4">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-slate-300 py-4">Medicine Details</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-slate-300 py-4">Category</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-gray-700 dark:text-slate-300 py-4">Pricing</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-gray-700 dark:text-slate-300 py-4">Stock Status</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-slate-300 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 transition-all duration-300 border-b border-gray-100 dark:border-slate-700">
                    <TableCell className="hidden sm:table-cell py-6">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 shadow-lg hover:scale-110 transition-transform duration-300">
                        <Image
                          alt={medicine.name}
                          className="object-cover"
                          fill
                          src={medicine.imageUrl}
                          unoptimized
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">{medicine.name}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Medicine ID: {medicine.id.slice(0, 8)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 px-3 py-1 text-sm font-medium">
                        {medicine.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${medicine.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">per unit</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-6">
                      <Badge variant={medicine.stock < 10 ? "destructive" : "default"} 
                             className={`px-3 py-2 text-sm font-bold ${
                               medicine.stock < 10 
                                 ? "bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700" 
                                 : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
                             }`}>
                        <Package className="h-3 w-3 mr-1" />
                        {medicine.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-xl transition-all duration-300 hover:scale-110">
                              <MoreHorizontal className="h-5 w-5" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-gray-200 dark:border-slate-700 shadow-xl">
                            <DropdownMenuLabel className="text-gray-700 dark:text-slate-300 font-bold">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(medicine)} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300">
                              Edit Medicine
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive focus:text-destructive hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/30 dark:hover:to-orange-900/30 transition-all duration-300">
                                Delete Medicine
                               </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-gray-200 dark:border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-900 dark:text-white">Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                              This action cannot be undone. This will permanently delete the medicine from your inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-gray-100 dark:hover:bg-slate-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(medicine.id)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300">
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

      <MedicineDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        medicine={selectedMedicine}
        pharmacies={pharmacies}
      />
    </div>
  );
}