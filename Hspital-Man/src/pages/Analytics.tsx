import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Analytics() {
  const monthlyData = [
    { month: 'Jan', patients: 245, revenue: 45230, appointments: 312 },
    { month: 'Feb', patients: 268, revenue: 48900, appointments: 345 },
    { month: 'Mar', patients: 290, revenue: 52100, appointments: 378 },
    { month: 'Apr', patients: 315, revenue: 56780, appointments: 410 },
    { month: 'May', patients: 342, revenue: 61250, appointments: 445 },
    { month: 'Jun', patients: 368, revenue: 65890, appointments: 480 },
  ];

  const topDiseases = [
    { name: 'Hypertension', cases: 145, trend: '+12%' },
    { name: 'Diabetes Type 2', cases: 98, trend: '+8%' },
    { name: 'Common Cold', cases: 87, trend: '-5%' },
    { name: 'Asthma', cases: 76, trend: '+3%' },
    { name: 'Migraine', cases: 54, trend: '+15%' },
  ];

  const departmentStats = [
    { name: 'Cardiology', patients: 234, revenue: 58900, satisfaction: 4.8 },
    { name: 'Orthopedics', patients: 198, revenue: 45600, satisfaction: 4.6 },
    { name: 'Pediatrics', patients: 312, revenue: 38900, satisfaction: 4.9 },
    { name: 'General Medicine', patients: 456, revenue: 52300, satisfaction: 4.7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
          Analytics & Reports
        </h2>
        <p className="text-muted-foreground">Comprehensive insights into hospital operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Growth</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.2%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointment Rate</CardTitle>
            <Calendar className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +4.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <DollarSign className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+21.8%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Strong performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
            <Heart className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5.0</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Excellent ratings
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Patient admissions and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(-3).map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{data.month}</span>
                        <span className="text-muted-foreground">
                          {data.patients} patients • {data.appointments} appointments
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-primary"
                          style={{ width: `${(data.appointments / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Diagnoses</CardTitle>
                <CardDescription>Most common conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDiseases.map((disease) => (
                    <div key={disease.name} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{disease.name}</p>
                        <p className="text-xs text-muted-foreground">{disease.cases} cases</p>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          disease.trend.startsWith('+') ? 'text-destructive' : 'text-success'
                        }`}
                      >
                        {disease.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Age and gender distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Age 0-18</span>
                    <span className="text-sm text-muted-foreground">28%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[28%] rounded-full bg-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Age 19-40</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[42%] rounded-full bg-success" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Age 41-65</span>
                    <span className="text-sm text-muted-foreground">22%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[22%] rounded-full bg-warning" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Age 65+</span>
                    <span className="text-sm text-muted-foreground">8%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-[8%] rounded-full bg-destructive" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
              <CardDescription>Financial performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="font-bold">${data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-primary"
                        style={{ width: `${(data.revenue / 70000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {departmentStats.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <CardTitle>{dept.name}</CardTitle>
                  <CardDescription>Department Performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Patients</span>
                    <span className="font-bold">{dept.patients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-bold">${dept.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Satisfaction</span>
                    <span className="font-bold text-success">{dept.satisfaction}/5.0</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
