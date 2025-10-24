import Image from 'next/image';
import type { Pharmacy } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Image
          src={pharmacy.logoUrl}
          alt={`${pharmacy.name} logo`}
          width={64}
          height={64}
          data-ai-hint="pharmacy logo"
          className="rounded-full border"
          unoptimized
        />
        <div>
          <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{pharmacy.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground">{pharmacy.address}</p>
      </CardContent>
    </Card>
  );
}
