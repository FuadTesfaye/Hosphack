import Image from 'next/image';
import Link from 'next/link';
import type { Medicine, Pharmacy } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from './ui/badge';
import { Pill, Store, Star, ShoppingCart, Shield } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  pharmacy?: Pharmacy;
}

export function MedicineCard({ medicine, pharmacy }: MedicineCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2 hover:scale-105">
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            fill
            data-ai-hint="medicine product"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* License Badge */}
          {medicine.requiresLicense && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
              <Shield className="w-3 h-3" />
              Rx Required
            </div>
          )}
          
          {/* Stock Status */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
            medicine.stock > 10 
              ? 'bg-green-500 text-white' 
              : medicine.stock > 0 
                ? 'bg-yellow-500 text-white' 
                : 'bg-red-500 text-white'
          }`}>
            {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
          </div>
        </div>
        
        <div className="p-4 pb-2">
          <Badge 
            variant="secondary" 
            className="mb-3 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border-blue-200 group-hover:from-blue-200 group-hover:to-green-200 transition-all duration-300"
          >
            <Pill className="w-3 h-3 mr-1" />
            {medicine.category}
          </Badge>
          
          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
            <Link href={`/medicines/${medicine.id}`} className="hover:text-primary transition-colors">
              {medicine.name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 group-hover:text-gray-600 transition-colors duration-300">
          {medicine.description}
        </p>
        
        {pharmacy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
            <Store className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Sold by {pharmacy.name}</span>
            <div className="flex items-center ml-auto">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs ml-1">{pharmacy.rating}</span>
            </div>
          </div>
        )}
        
        {/* Expiry Date */}
        <div className="text-xs text-gray-500 mb-2">
          Expires: {new Date(medicine.expirationDate).toLocaleDateString()}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0 bg-gradient-to-r from-gray-50 to-blue-50 group-hover:from-blue-50 group-hover:to-green-50 transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            ${medicine.price.toFixed(2)}
          </span>
          {medicine.price > 50 && (
            <span className="text-xs text-green-600 font-medium">Free shipping</span>
          )}
        </div>
        
        <Button 
          asChild 
          className={`transform transition-all duration-300 hover:scale-105 shadow-lg ${
            medicine.stock === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 hover:shadow-xl'
          }`}
          disabled={medicine.stock === 0}
        >
          <Link href={`/medicines/${medicine.id}`} className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {medicine.stock === 0 ? 'Out of Stock' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-green-400 rounded-lg transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"></div>
    </Card>
  );
}