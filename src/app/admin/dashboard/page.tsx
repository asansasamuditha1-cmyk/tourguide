
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Trash2, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

const placeholderUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    lastSignIn: "2024-07-20T10:30:00Z",
    isAdmin: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    lastSignIn: "2024-07-19T15:00:00Z",
    isAdmin: false,
  },
  {
    id: "3",
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    lastSignIn: "2024-07-21T09:00:00Z",
    isAdmin: false,
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    lastSignIn: "2024-07-21T11:45:00Z",
    isAdmin: true,
  },
];


export default function AdminDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
    // In a real app, you would also check for an admin custom claim here
  }, [user, loading, router]);

  if (loading || !user) {
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
                    {placeholderUsers.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={u.avatar} />
                                        <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{u.name}</p>
                                        <p className="text-sm text-muted-foreground">{u.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {new Date(u.lastSignIn).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Switch id={`admin-switch-${u.id}`} checked={u.isAdmin} disabled />
                                    <label htmlFor={`admin-switch-${u.id}`} className="text-sm font-medium">{u.isAdmin ? 'Admin' : 'User'}</label>
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
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}
