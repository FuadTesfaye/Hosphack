import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { doctorApi } from "@/lib/api";
import { useDoctorStore } from "@/stores/doctorStore";

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const { doctors, setDoctors, setLoading, setError } = useDoctorStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorApi.getAll(),
  });

  useEffect(() => {
    if (data?.data) {
      setDoctors(data.data);
    }
    setLoading(isLoading);
    setError(error?.message || null);
  }, [data, isLoading, error, setDoctors, setLoading, setError]);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doctors</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {doctor.specialization}
                    </div>
                  </div>
                  <Badge variant={doctor.isActive ? "default" : "secondary"}>
                    {doctor.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Department:</span> {doctor.department}
                  </div>
                  <div>
                    <span className="font-medium">Experience:</span> {doctor.experienceYears} years
                  </div>
                  <div>
                    <span className="font-medium">Fee:</span> ${doctor.consultationFee}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {doctor.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {doctor.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDoctors.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No doctors found.</p>
        </div>
      )}
    </div>
  );
}