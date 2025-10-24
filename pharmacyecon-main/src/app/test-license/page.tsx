'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLicensePage() {
  const [email, setEmail] = useState('test@example.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const createTestLicense = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-license-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-test-license',
          customerEmail: email
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Test failed', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-license-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check-cart',
          customerEmail: email
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Check failed', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test License Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Email:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter customer email"
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={createTestLicense} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Create & Approve Test License'}
            </Button>
            
            <Button 
              onClick={checkCart} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Check Cart
            </Button>
          </div>
          
          {result && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}