import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inventoryApi } from "@/lib/api";
import { useInventoryStore } from "@/stores/inventoryStore";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { items, setItems, setLoading, setError } = useInventoryStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryApi.getAll(),
  });

  const { data: lowStockData } = useQuery({
    queryKey: ["inventory-low-stock"],
    queryFn: () => inventoryApi.getLowStock(),
  });

  const { data: expiringData } = useQuery({
    queryKey: ["inventory-expiring"],
    queryFn: () => inventoryApi.getExpiring(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: () => inventoryApi.getStatistics(),
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory && item.isActive;
  });

  const getStockStatus = (item: any) => {
    if (item.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (item.quantity <= item.minimumStock) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage medical supplies and equipment</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{statsData?.data?.TotalItems || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{statsData?.data?.LowStockItems || 0}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{statsData?.data?.ExpiringItems || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${statsData?.data?.TotalInventoryValue?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Medicine">Medicine</SelectItem>
            <SelectItem value="Equipment">Equipment</SelectItem>
            <SelectItem value="Supplies">Supplies</SelectItem>
            <SelectItem value="Surgical">Surgical</SelectItem>
            <SelectItem value="Laboratory">Laboratory</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Inventory Grid */}
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
          {filteredItems.map((item) => {
            const stockStatus = getStockStatus(item);
            const expiringSoon = isExpiringSoon(item.expiryDate);
            
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge className={stockStatus.color} variant="secondary">
                      {stockStatus.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Quantity:</span>
                      <p className="text-lg font-bold">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <p className="text-lg font-bold">${item.price}</p>
                    </div>
                  </div>
                  
                  {item.supplier && (
                    <div className="text-sm">
                      <span className="font-medium">Supplier:</span> {item.supplier}
                    </div>
                  )}
                  
                  {item.location && (
                    <div className="text-sm">
                      <span className="font-medium">Location:</span> {item.location}
                    </div>
                  )}
                  
                  {item.expiryDate && (
                    <div className="text-sm">
                      <span className="font-medium">Expires:</span>
                      <span className={expiringSoon ? "text-orange-600 font-medium" : ""}>
                        {" "}{new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                      {expiringSoon && (
                        <Badge className="ml-2 bg-orange-100 text-orange-800" variant="secondary">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {item.batchNumber && (
                    <div className="text-sm">
                      <span className="font-medium">Batch:</span> {item.batchNumber}
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-medium">Stock Range:</span> {item.minimumStock} - {item.maximumStock} {item.unit}
                  </div>
                  
                  {item.description && (
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No inventory items found</p>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Add your first inventory item to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
}