'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Bot, 
  Pill, 
  Heart, 
  Shield, 
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  Award,
  ArrowRight,
  Stethoscope,
  Activity
} from 'lucide-react';
import { MedicineCard } from '@/components/medicine-card';
import { getMedicines, getPharmacies } from '@/lib/api';
import type { Medicine, Pharmacy } from '@/lib/types';

export default function RecommendationsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [recommendations, setRecommendations] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: ''
  });

  useEffect(() => {
    loadData();
    setIsVisible(true);
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI recommendations based on symptoms
    const mockRecommendations = medicines.slice(0, 4);
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30 animate-pulse">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Healthcare
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Smart Medicine
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get personalized medicine recommendations powered by advanced AI technology and expert medical knowledge.
            </p>

            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>FDA Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                <span>Doctor Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* AI Form Section */}
        <Card className={`mb-12 border-0 shadow-2xl bg-white/90 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Bot className="w-10 h-10 text-purple-500 animate-pulse" />
              AI Health Assistant
            </CardTitle>
            <p className="text-gray-600 mt-2 text-lg">
              Tell us about your symptoms and health condition for personalized recommendations
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Symptoms Input */}
              <div className="space-y-3">
                <Label htmlFor="symptoms" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Current Symptoms *
                </Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, etc.)"
                  className="min-h-24 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg resize-none text-lg"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Age Input */}
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Age *
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    className="h-14 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg text-lg"
                    required
                  />
                </div>

                {/* Allergies Input */}
                <div className="space-y-3">
                  <Label htmlFor="allergies" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Known Allergies
                  </Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any drug allergies"
                    className="h-14 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg text-lg"
                  />
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-3">
                <Label htmlFor="medicalHistory" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Medical History
                </Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Any chronic conditions, past surgeries, or ongoing health issues"
                  className="min-h-20 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg resize-none text-lg"
                />
              </div>

              {/* Current Medications */}
              <div className="space-y-3">
                <Label htmlFor="currentMedications" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-green-500" />
                  Current Medications
                </Label>
                <Textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="List any medications you're currently taking"
                  className="min-h-20 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg resize-none text-lg"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !formData.symptoms || !formData.age}
                  className="px-12 py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      AI is analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Get AI Recommendations
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="mb-12 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 animate-pulse">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                AI is Processing Your Information
              </h3>
              <p className="text-gray-600 text-lg">
                Our advanced AI is analyzing your symptoms and medical history to provide personalized recommendations...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Results */}
        {recommendations.length > 0 && !loading && (
          <div className={`transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Results Header */}
            <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-green-800">
                      AI Recommendations Ready!
                    </h2>
                    <p className="text-green-600 text-lg">
                      Based on your symptoms and health profile, here are our top recommendations
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-800 px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Personalized for You
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Safety Verified
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    AI Powered
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Pill className="w-8 h-8 text-purple-500" />
                Recommended Medicines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((medicine, index) => {
                  const pharmacy = pharmacies.find(p => p.id === medicine.pharmacyId);
                  return (
                    <div 
                      key={medicine.id}
                      className={`relative transform transition-all duration-500 hover:scale-105 animate-fade-in-up hover-lift`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <MedicineCard medicine={medicine} pharmacy={pharmacy} />
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                        AI PICK #{index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Important Medical Disclaimer</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These AI-generated recommendations are for informational purposes only and should not replace professional medical advice. 
                      Always consult with a qualified healthcare provider before starting any new medication or treatment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        {recommendations.length === 0 && !loading && (
          <div className={`text-center transform transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 border-0 text-white">
              <CardContent className="p-12">
                <Brain className="w-20 h-20 mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Fill out the form above to receive personalized medicine recommendations powered by our advanced AI technology
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    onClick={() => document.getElementById('symptoms')?.focus()}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start AI Analysis
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}