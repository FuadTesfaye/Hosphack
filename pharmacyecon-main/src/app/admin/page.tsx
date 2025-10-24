import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Pill, ShoppingCart, Store, Stethoscope, FileText, TrendingUp, Users, Package } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
    const adminFeatures = [
        { href: '/admin/dashboard', title: 'Dashboard', description: 'View analytics and overview', icon: <LayoutDashboard className="h-8 w-8" />, color: 'from-blue-500 to-cyan-500' },
        { href: '/admin/medicines', title: 'Medicines', description: 'Manage your inventory', icon: <Pill className="h-8 w-8" />, color: 'from-green-500 to-emerald-500' },
        { href: '/admin/orders', title: 'Orders', description: 'Track and manage orders', icon: <ShoppingCart className="h-8 w-8" />, color: 'from-purple-500 to-pink-500' },
        { href: '/admin/pharmacies', title: 'Pharmacies', description: 'Manage pharmacy network', icon: <Store className="h-8 w-8" />, color: 'from-orange-500 to-red-500' },
        { href: '/admin/prescription-uploads', title: 'Prescriptions', description: 'Review prescription uploads', icon: <FileText className="h-8 w-8" />, color: 'from-teal-500 to-blue-500' },
        { href: '/admin/license-requests', title: 'License Requests', description: 'Review prescription licenses', icon: <Stethoscope className="h-8 w-8" />, color: 'from-indigo-500 to-purple-500' },
    ];

    const stats = [
        { label: 'Total Medicines', value: '1,234', icon: <Package className="h-5 w-5" />, change: '+12%' },
        { label: 'Active Orders', value: '89', icon: <ShoppingCart className="h-5 w-5" />, change: '+5%' },
        { label: 'Pharmacies', value: '45', icon: <Store className="h-5 w-5" />, change: '+2%' },
        { label: 'Pending Requests', value: '23', icon: <FileText className="h-5 w-5" />, change: '-8%' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-float">
                        <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Admin Control Center
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Welcome to your comprehensive pharmacy management system. Monitor, manage, and optimize your entire network.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={stat.label} className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change} from last month
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white">
                                    {stat.icon}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {adminFeatures.map((feature, index) => (
                        <Card key={feature.title} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <CardHeader className="text-center relative z-10">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center relative z-10">
                                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                                <Button asChild className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg transition-all duration-300 border-0`}>
                                    <Link href={feature.href}>Access {feature.title}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        System Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <div>
                                <p className="font-medium text-green-900">All Systems Operational</p>
                                <p className="text-sm text-green-700">Database & API running smoothly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                            <div>
                                <p className="font-medium text-blue-900">Real-time Sync Active</p>
                                <p className="text-sm text-blue-700">Data synchronized across all modules</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                            <div>
                                <p className="font-medium text-purple-900">Security Monitoring</p>
                                <p className="text-sm text-purple-700">Advanced threat protection enabled</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}