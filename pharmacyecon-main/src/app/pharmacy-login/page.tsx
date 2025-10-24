'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PharmacyLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`🔐 Attempting login for: ${email}`);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Login response:', data);

      if (response.ok && data.success) {
        localStorage.setItem('pharmacy', JSON.stringify(data.pharmacy));
        console.log(`✅ Login successful, redirecting to dashboard: ${data.pharmacy.id}`);
        
        toast({
          title: 'Login successful',
          description: `Welcome back, ${data.pharmacy.name}!`,
        });
        
        // Force navigation
        window.location.href = `/pharmacy-dashboard/${data.pharmacy.id}`;
      } else {
        console.log(`❌ Login failed:`, data.error);
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: data.error || 'Invalid credentials',
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'An error occurred during login',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Stethoscope className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold">Pharmacy Login</h1>
          <p className="text-muted-foreground mt-2">Access your pharmacy dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}