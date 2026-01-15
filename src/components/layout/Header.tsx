'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Map, Compass, BookOpen, User } from 'lucide-react';
import { LankaGuideLogo } from '@/components/icons/LankaGuideLogo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Explore', icon: Compass },
  { href: '/planner', label: 'AI Planner', icon: Map },
  { href: '/ar-explorer', label: 'AR View', icon: Compass },
  { href: '/maps', label: 'Offline Maps', icon: Map },
  { href: '/my-tours', label: 'My Tours', icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string; label: string; icon: React.ElementType; isMobile?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} passHref>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(isMobile ? 'w-full justify-start' : '')}
          onClick={() => setSheetOpen(false)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <LankaGuideLogo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">LankaGuide AI</span>
          </Link>
        </div>
        <nav className="hidden flex-1 items-center space-x-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button className="hidden md:inline-flex" variant="outline">
            <User className="mr-2 h-4 w-4" />
            Login
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setSheetOpen(false)}>
                  <LankaGuideLogo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">LankaGuide AI</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
