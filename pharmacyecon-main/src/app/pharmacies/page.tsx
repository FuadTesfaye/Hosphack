'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getPharmacies } from '@/lib/api';
import { 
  MapPin, 
  Phone, 
  Star, 
  Search, 
  Store, 
  Award, 
  Clock, 
  Shield,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  Navigation
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Pharmacy } from '@/lib/types';

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadPharmacies();
    setIsVisible(true);
  }, []);

  const loadPharmacies = async () => {
    try {
      const data = await getPharmacies();
      setPharmacies(data);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const ratingFilters = ['all', '5', '4+', '3+'];

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRating = true;
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating.replace('+', ''));
      matchesRating = pharmacy.rating >= minRating;
    }
    
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading pharmacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30 animate-pulse">
              <Award className="w-4 h-4 mr-2" />
              Trusted Healthcare Partners
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Trusted Pharmacy
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover verified pharmacies near you with licensed professionals and quality medicines.
            </p>

            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Licensed & Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Trusted by Thousands</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <Card className={`mb-12 border-0 shadow-2xl bg-white/90 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                <Input
                  placeholder="Search pharmacies by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 h-16 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-2xl transition-all duration-300 hover:shadow-lg bg-white/80"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl">
                    <Navigation className="w-4 h-4 mr-2" />
                    Near Me
                  </Button>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Filter by Rating:
                </span>
                {ratingFilters.map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRating(rating)}
                    className={`transition-all duration-300 transform hover:scale-105 ${
                      selectedRating === rating 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg' 
                        : 'hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    {rating === 'all' ? 'All Ratings' : `${rating} Stars`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className={`mb-8 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Trusted Pharmacies
              </h2>
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200">
                <Store className="w-4 h-4 mr-1" />
                {filteredPharmacies.length} pharmacies found
              </Badge>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
        </div>

        {/* Pharmacies Grid */}
        {filteredPharmacies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPharmacies.map((pharmacy, index) => (
              <Card 
                key={pharmacy.id}
                className={`group overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl animate-fade-in-up hover-lift`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={pharmacy.logoUrl}
                      alt={pharmacy.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-800">{pharmacy.rating}</span>
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                      <Shield className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {pharmacy.name}
                  </CardTitle>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{pharmacy.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{pharmacy.phone}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-300">
                      <Users className="w-3 h-3 mr-1" />
                      Expert Staff
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-300">
                      <Clock className="w-3 h-3 mr-1" />
                      Fast Service
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      asChild 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href={`/pharmacy-medicines/${pharmacy.id}`} className="flex items-center justify-center gap-2">
                        <Store className="w-4 h-4" />
                        Visit Store
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 group/btn"
                    >
                      <Heart className="w-4 h-4 group-hover/btn:text-red-500 transition-colors duration-300" />
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 rounded-lg transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"></div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="p-16 text-center">
              <Store className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">No pharmacies found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or rating filter to find more pharmacies in your area
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRating('all');
                }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Show All Pharmacies
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {filteredPharmacies.length > 0 && (
          <div className={`mt-16 transform transition-all duration-700 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardContent className="p-12 text-center relative">
                <div className="max-w-2xl mx-auto">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 animate-bounce" />
                  <h3 className="text-3xl font-bold mb-4">
                    Want to Partner With Us?
                  </h3>
                  <p className="text-xl mb-8 opacity-90">
                    Join our network of trusted pharmacies and reach more customers in your community
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      Become a Partner
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              {/* Floating Elements */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 rounded-full animate-float-delayed"></div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}