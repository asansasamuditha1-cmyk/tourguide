
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Define a type for the user data we expect from our API
type AppUser = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  metadata: {
    lastSignInTime: string | undefined;
  };
  customClaims: { [key: string]: any } | undefined;
};


export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if (user) {
      // Fetch the users from our new API route
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          // We need to send the user's auth token to verify they are an admin
          const token = await user.getIdToken();
          const response = await fetch('/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch users.');
          }

          const data: AppUser[] = await response.json();
          setUsers(data);
        } catch (error) {
          console.error(error);
          // In a real app, you'd show a toast notification here
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('');
  };
  
  const UserTableSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="space-y-8">
       <section>
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage users and application settings.
        </p>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, edit, and manage all registered users.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/register">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Admin
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Last Sign-In</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loadingUsers ? (
                      <UserTableSkeleton />
                    ) : (
                      users.map((u) => {
                        const isAdmin = u.customClaims?.isAdmin === true;
                        return (
                          <TableRow key={u.uid}>
                              <TableCell>
                                  <div className="flex items-center gap-4">
                                      <Avatar>
                                          <AvatarImage src={u.photoURL || undefined} />
                                          <AvatarFallback>{getInitials(u.displayName)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-medium">{u.displayName || 'No Name'}</p>
                                          <p className="text-sm text-muted-foreground">{u.email}</p>
                                      </div>
                                  </div>
                              </TableCell>
                              <TableCell>
                                  {u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).toLocaleString() : 'Never'}
                              </TableCell>
                              <TableCell>
                                  <div className="flex items-center space-x-2">
                                      <Switch id={`admin-switch-${u.uid}`} checked={isAdmin} disabled />
                                      <label htmlFor={`admin-switch-${u.uid}`} className="text-sm font-medium">{isAdmin ? 'Admin' : 'User'}</label>
                                  </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                              <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem disabled>
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive"/>
                                            <span className="text-destructive">Delete User</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                </TableBody>
            </Table>
             { !loadingUsers && users.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No users found.</p>
             )}
        </CardContent>
      </Card>

    </div>
  );
}
