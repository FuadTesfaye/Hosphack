import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Activity, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { usePatientStore } from '@/stores/patientStore';

export default function Dashboard() {
  const patients = usePatientStore((state) => state.patients);

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      trend: { value: '+12% from last month', isPositive: true },
      variant: 'primary' as const,
    },
    {
      title: "Today's Appointments",
      value: 24,
      icon: Calendar,
      trend: { value: '8 pending', isPositive: true },
      variant: 'success' as const,
    },
    {
      title: 'Active Treatments',
      value: 48,
      icon: Activity,
      trend: { value: '+5 new this week', isPositive: true },
      variant: 'default' as const,
    },
    {
      title: 'Revenue (Month)',
      value: '$45,231',
      icon: DollarSign,
      trend: { value: '+18% from last month', isPositive: true },
      variant: 'success' as const,
    },
  ];

  const recentActivity = [
    { patient: 'John Doe', action: 'New appointment scheduled', time: '10 mins ago', type: 'appointment' },
    { patient: 'Sarah Smith', action: 'Medical record updated', time: '25 mins ago', type: 'record' },
    { patient: 'Robert Johnson', action: 'Payment received', time: '1 hour ago', type: 'payment' },
    { patient: 'Emily Davis', action: 'Lab results uploaded', time: '2 hours ago', type: 'lab' },
    { patient: 'Michael Wilson', action: 'Prescription refilled', time: '3 hours ago', type: 'prescription' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.patient}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bed Occupancy</span>
                <span className="text-sm font-semibold text-primary">85%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[85%] rounded-full bg-gradient-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Staff Availability</span>
                <span className="text-sm font-semibold text-success">92%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[92%] rounded-full bg-success" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Patient Satisfaction</span>
                <span className="text-sm font-semibold text-success">4.8/5.0</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[96%] rounded-full bg-success" />
              </div>
            </div>

            <div className="rounded-lg bg-gradient-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Performance</p>
                  <p className="text-xs opacity-90">All metrics trending positive</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
