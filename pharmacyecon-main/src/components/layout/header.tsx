'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Stethoscope, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '../ui/badge';

export function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { href: '/medicines', label: 'Medicine Finder' },
    { href: '/pharmacies', label: 'Pharmacies' },
    { href: '/customer-register', label: 'Contact Pharmacy' },
    { href: '/upload-prescription', label: 'Upload Prescription' },
    { href: '/recommendations', label: 'AI Recommendations' },
  ];

  const NavLinks = () =>
    navItems.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === item.href ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {item.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-bold">MediLink Lite</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center gap-6">
          <NavLinks />
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
           <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 justify-center p-1">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">View Cart</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pharmacy-login">Pharmacy Login</Link>
          </Button>
          <Button asChild>
            <Link href="/admin">Admin Panel</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <span className="font-bold">MediLink Lite</span>
                </Link>
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
