import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, billingApi } from '@/lib/api';

export default function Analytics() {
  const { data: dashboardData } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsApi.getDashboard(),
  });

  const { data: demographicsData } = useQuery({
    queryKey: ['patient-demographics'],
    queryFn: () => analyticsApi.getPatientDemographics(),
  });

  const { data: growthData } = useQuery({
    queryKey: ['patient-growth'],
    queryFn: () => analyticsApi.getPatientGrowth(),
  });

  const { data: bloodGroupData } = useQuery({
    queryKey: ['blood-groups'],
    queryFn: () => analyticsApi.getBloodGroups(),
  });

  const { data: insuranceData } = useQuery({
    queryKey: ['insurance-stats'],
    queryFn: () => analyticsApi.getInsuranceStats(),
  });

  const { data: monthlyRevenueData } = useQuery({
    queryKey: ['monthly-revenue-analytics'],
    queryFn: () => billingApi.getMonthlyRevenue(),
  });

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
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.data?.TotalPatients?.toLocaleString() || '0'}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Calendar className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.data?.NewPatientsThisMonth || '0'}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData?.data?.TotalRevenue?.toLocaleString() || '0'}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Strong performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Rate</CardTitle>
            <Heart className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insuranceData?.data?.InsuranceRate?.toFixed(1) || '0'}%</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Coverage rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth</CardTitle>
                <CardDescription>Monthly patient registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(growthData?.data || []).slice(-6).map((data: any) => (
                    <div key={data.Month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{data.Month}</span>
                        <span className="text-muted-foreground">
                          {data.Count} patients
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-primary"
                          style={{ width: `${Math.min((data.Count / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Group Distribution</CardTitle>
                <CardDescription>Patient blood group statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(bloodGroupData?.data || []).slice(0, 8).map((group: any) => (
                    <div key={group.BloodGroup} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{group.BloodGroup}</p>
                        <p className="text-xs text-muted-foreground">{group.Count} patients</p>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {((group.Count / (dashboardData?.data?.TotalPatients || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Patient demographics by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(demographicsData?.data?.GenderDistribution || []).map((gender: any) => (
                    <div key={gender.Gender}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{gender.Gender}</span>
                        <span className="text-sm text-muted-foreground">{gender.Count} patients</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div 
                          className="h-full rounded-full bg-primary" 
                          style={{ 
                            width: `${((gender.Count / (dashboardData?.data?.TotalPatients || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Patient age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(demographicsData?.data?.AgeDistribution || []).map((age: any) => (
                    <div key={age.AgeGroup}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{age.AgeGroup}</span>
                        <span className="text-sm text-muted-foreground">{age.Count} patients</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div 
                          className="h-full rounded-full bg-success" 
                          style={{ 
                            width: `${((age.Count / (dashboardData?.data?.TotalPatients || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Financial performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(monthlyRevenueData?.data || []).map((data: any) => (
                  <div key={data.Month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Month {data.Month}</span>
                      <span className="font-bold">${data.Revenue?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-primary"
                        style={{ width: `${Math.min((data.Revenue / 100000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Coverage</CardTitle>
                <CardDescription>Patient insurance statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Insured Patients</span>
                  <span className="font-bold">{insuranceData?.data?.InsuredPatients || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uninsured Patients</span>
                  <span className="font-bold">{insuranceData?.data?.UninsuredPatients || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coverage Rate</span>
                  <span className="font-bold text-success">{insuranceData?.data?.InsuranceRate?.toFixed(1) || 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Insurance Providers</CardTitle>
                <CardDescription>Most common insurance companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(insuranceData?.data?.TopInsuranceProviders || []).slice(0, 5).map((provider: any) => (
                  <div key={provider.Provider} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{provider.Provider}</span>
                    <span className="text-sm text-muted-foreground">{provider.Count} patients</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}