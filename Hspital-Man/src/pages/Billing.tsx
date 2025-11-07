import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, DollarSign, CreditCard, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { billingApi } from "@/lib/api";
import { useBillingStore } from "@/stores/billingStore";

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { bills, setBills, setLoading, setError } = useBillingStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bills"],
    queryFn: () => billingApi.getAll(),
  });

  const { data: unpaidData } = useQuery({
    queryKey: ["bills-unpaid"],
    queryFn: () => billingApi.getUnpaid(),
  });

  const { data: overdueData } = useQuery({
    queryKey: ["bills-overdue"],
    queryFn: () => billingApi.getOverdue(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["billing-stats"],
    queryFn: () => billingApi.getStatistics(),
  });

  const { data: monthlyRevenueData } = useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: () => billingApi.getMonthlyRevenue(),
  });

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "paid" && bill.isPaid) ||
      (statusFilter === "unpaid" && !bill.isPaid);
    
    return matchesSearch && matchesStatus;
  });

  const isOverdue = (billingDate: string, isPaid: boolean) => {
    if (isPaid) return false;
    const billing = new Date(billingDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return billing < thirtyDaysAgo;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage patient bills and track payments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${statsData?.data?.TotalRevenue?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${statsData?.data?.ThisMonthRevenue?.toLocaleString() || '0'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">${statsData?.data?.PendingAmount?.toLocaleString() || '0'}</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unpaid Bills</p>
                <p className="text-2xl font-bold text-red-600">{statsData?.data?.UnpaidBills || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient ID..."
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
            <SelectItem value="all">All Bills</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Bills List */}
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
          {filteredBills.map((bill) => {
            const overdue = isOverdue(bill.billingDate, bill.isPaid);
            
            return (
              <Card key={bill.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">Bill #{bill.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Patient ID: {bill.patientId.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Billing Date:</span> {new Date(bill.billingDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${bill.amount.toLocaleString()}
                        </div>
                        {overdue && (
                          <Badge className="bg-red-100 text-red-800" variant="secondary">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${bill.amount.toLocaleString()}</span>
                      <Badge 
                        className={bill.isPaid 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                        }
                        variant="secondary"
                      >
                        {bill.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                  
                  {!bill.isPaid && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button size="sm" variant="outline">
                        Send Reminder
                      </Button>
                      <Button size="sm">
                        Mark as Paid
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredBills.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No bills found</p>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Generate your first bill to get started"
            }
          </p>
        </div>
      )}

      {/* Monthly Revenue Chart Section */}
      {monthlyRevenueData?.data && monthlyRevenueData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {monthlyRevenueData.data.map((month: any) => (
                <div key={month.Month} className="text-center">
                  <p className="text-sm text-muted-foreground">Month {month.Month}</p>
                  <p className="text-lg font-bold">${month.Revenue?.toLocaleString() || '0'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}