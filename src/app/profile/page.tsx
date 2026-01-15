
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LoaderCircle, User, Mail, LogOut, Shield } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="space-y-8">
       <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Your Profile</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.displayName || "User"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Review and manage your account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="displayName" value={user.displayName || ""} readOnly className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={user.email || ""} readOnly className="pl-10" />
                </div>
              </div>
              
              <Separator />

              <div className="space-y-4">
                 <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-md font-semibold">Security</h3>
                </div>
                <Button variant="secondary">Change Password</Button>
                <p className="text-sm text-muted-foreground">
                    It's a good idea to use a strong password that you're not using elsewhere.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
