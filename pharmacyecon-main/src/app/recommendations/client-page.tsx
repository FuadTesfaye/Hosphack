'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { getRecommendationsAction } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Pill, Lightbulb } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Get Recommendations
    </Button>
  );
}

export function RecommendationsClientPage() {
  const initialState = { message: '', error: '' };
  const [state, dispatch] = useActionState(getRecommendationsAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div>
      <Card>
        <form action={dispatch}>
          <CardHeader>
            <CardTitle>Provide Your Information</CardTitle>
            <CardDescription>
              Enter your prescribed medication and recent medicine searches to get personalized suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescribedMedication">Prescribed Medication</Label>
              <Input
                id="prescribedMedication"
                name="prescribedMedication"
                placeholder="e.g., Lisinopril"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchHistory">Search History</Label>
              <Textarea
                id="searchHistory"
                name="searchHistory"
                placeholder="e.g., Paracetamol, Ibuprofen, Vitamin C"
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter medicine names, separated by commas.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.recommendations && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-primary" />
              Recommended Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">
                {state.recommendations.recommendedAlternatives.split(',').join(', ')}
            </p>
          </CardContent>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                {state.recommendations.reasoning}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
