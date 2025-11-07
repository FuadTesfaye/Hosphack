import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Calendar, Clock, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { appointmentApi } from "@/lib/api";
import { useAppointmentStore } from "@/stores/appointmentStore";

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800",
  Confirmed: "bg-green-100 text-green-800", 
  InProgress: "bg-yellow-100 text-yellow-800",
  Completed: "bg-gray-100 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
  NoShow: "bg-orange-100 text-orange-800",
};

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { appointments, setAppointments, setLoading, setError } = useAppointmentStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentApi.getAll(),
  });

  const { data: upcomingData } = useQuery({
    queryKey: ["appointments-upcoming"],
    queryFn: () => appointmentApi.getUpcoming(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["appointment-stats"],
    queryFn: () => appointmentApi.getStatistics(),
  });

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage patient appointments and schedules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{statsData?.data?.TodayAppointments || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{statsData?.data?.ThisWeekAppointments || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statsData?.data?.TotalAppointments || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingData?.data?.length || 0}</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="NoShow">No Show</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{appointment.reason}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointmentType} • {appointment.durationMinutes} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(appointment.appointmentDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Patient ID: {appointment.patientId.slice(0, 8)}...
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        Doctor ID: {appointment.doctorId.slice(0, 8)}...
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {appointment.fee && (
                      <span className="text-sm font-medium">${appointment.fee}</span>
                    )}
                    <Badge 
                      className={statusColors[appointment.status as keyof typeof statusColors]}
                      variant="secondary"
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAppointments.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No appointments found</p>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Schedule your first appointment to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
}