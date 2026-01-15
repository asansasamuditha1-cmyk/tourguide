
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Map, Compass, BookOpen, User, LogOut, LoaderCircle } from 'lucide-react';
import { LankaGuideLogo } from '@/components/icons/LankaGuideLogo';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const navItems = [
  { href: '/', label: 'Explore', icon: Compass },
  { href: '/planner', label: 'AI Planner', icon: Map },
  { href: '/ar-explorer', label: 'AR View', icon: Compass, protected: true },
  { href: '/maps', label: 'Offline Maps', icon: Map },
  { href: '/my-tours', label: 'My Tours', icon: BookOpen, protected: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user, loading } = useUser();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  const NavLink = ({ href, label, icon: Icon, isMobile = false, protected: isProtected }: { href: string; label:string; icon: React.ElementType; isMobile?: boolean, protected?: boolean }) => {
    const isActive = pathname === href;

    if (isProtected && !user && !loading) return null;

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

  const AuthNav = () => {
    if (loading) {
      return <LoaderCircle className="h-5 w-5 animate-spin" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                 <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} />
                 <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
       <div className="space-x-2">
         <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
         </Button>
         <Button asChild>
            <Link href="/register">Register</Link>
         </Button>
       </div>
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
          <div className="hidden md:flex">
            <AuthNav />
          </div>
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
                   <div className="pt-4 border-t">
                      {user ? (
                        <>
                           <Button variant="ghost" className="w-full justify-start" onClick={() => { router.push('/profile'); setSheetOpen(false); }}>
                              <User className="mr-2 h-4 w-4" /> Profile
                           </Button>
                           <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setSheetOpen(false); }}>
                              <LogOut className="mr-2 h-4 w-4" /> Logout
                           </Button>
                        </>
                      ) : (
                        <>
                           <Button variant="ghost" className="w-full justify-start" onClick={() => { router.push('/login'); setSheetOpen(false); }}>
                              Login
                           </Button>
                           <Button variant="ghost" className="w-full justify-start" onClick={() => { router.push('/register'); setSheetOpen(false); }}>
                              Register
                           </Button>
                        </>
                      )}
                   </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
