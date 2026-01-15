
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthClientProps = {
  mode: "login" | "register";
};

export function AdminAuthClient({ mode }: AuthClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const schema = mode === "register" ? registerSchema : loginSchema;
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: mode === "register" ? { name: "", email: "", password: "" } : { email: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    if (!auth) {
        toast({ variant: "destructive", title: "Error", description: "Authentication service not available." });
        setIsLoading(false);
        return;
    }
    try {
      if (mode === "register") {
        const { name, email, password } = data as z.infer<typeof registerSchema>;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // In a real app, you'd trigger a cloud function here to set custom claims for the admin role.
        toast({ title: "Admin Registration successful!", description: "Welcome, Admin." });
        router.push("/profile"); // Or an admin dashboard
      } else {
        const { email, password } = data as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, email, password);
        // Here, you would typically check for an admin custom claim before proceeding.
        toast({ title: "Admin Login successful!", description: "Welcome back, Admin." });
        router.push("/profile"); // Or an admin dashboard
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-sm border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl pt-2">{mode === "login" ? "Admin Login" : "Admin Registration"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "Enter your credentials to access the admin panel." : "Enter details to create a new admin account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'register' && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Admin Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {mode === "login" ? (
              <>
                Need to create an admin account?{" "}
                <Link href="/admin/register" className="underline">
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an admin account?{" "}
                <Link href="/admin/login" className="underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
