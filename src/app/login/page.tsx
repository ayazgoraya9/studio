
"use client";

import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(login, undefined);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md">
         <div className="flex justify-center items-center gap-4 mb-8">
            <Logo className="w-16 h-16" />
            <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">
                RetailSync
            </h1>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <LoginButton />
            </form>
          </CardContent>
        </Card>
      </div>
       <footer className="mt-16 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} RetailSync. All rights reserved.</p>
        </footer>
    </div>
  );
}
