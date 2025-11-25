'use client';
import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { adminLogin, staffLogin, kitchenLogin, registerAdmin } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, KeyRound, ChefHat } from 'lucide-react';
import { PinInput } from '@/components/pin-input';
import { Logo } from '@/components/logo';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? 'Signing In...' : children}
    </Button>
  );
}

export default function LoginPage() {
  const [adminState, adminAction] = useActionState(adminLogin, undefined);
  const [staffState, staffAction] = useActionState(staffLogin, undefined);
  const [kitchenState, kitchenAction] = useActionState(kitchenLogin, undefined);
  const [registerState, registerAction] = useActionState(registerAdmin, undefined);
  const [showRegister, setShowRegister] = React.useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo className="text-2xl"/>
      </div>
      <Tabs defaultValue="staff" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staff"><KeyRound className="mr-2 h-4 w-4"/> Staff PIN</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="kitchen"><ChefHat className="mr-2 h-4 w-4"/>Kitchen</TabsTrigger>
        </TabsList>
        
        {/* Staff PIN Login */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Login</CardTitle>
              <CardDescription>Enter your unique PIN to access the POS.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={staffAction} className="space-y-4">
                <PinInput />
                {staffState?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{staffState.error}</AlertDescription>
                    </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Admin Login */}
        <TabsContent value="admin">
          {!showRegister ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access the administrative dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={adminAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="admin@example.com" required defaultValue="admin@swiftpos.com"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required defaultValue="admin"/>
                  </div>
                  {adminState?.error && (
                      <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Login Failed</AlertTitle>
                          <AlertDescription>{adminState.error}</AlertDescription>
                      </Alert>
                  )}
                  <SubmitButton>Sign In</SubmitButton>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setShowRegister(true)}>Register Admin</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Register Admin</CardTitle>
                <CardDescription>Create an administrator account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={registerAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" name="email" type="email" placeholder="admin@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" name="password" type="password" required />
                  </div>
                  {registerState?.error && (
                      <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Registration Failed</AlertTitle>
                          <AlertDescription>{registerState.error}</AlertDescription>
                      </Alert>
                  )}
                  <SubmitButton>Create Admin Account</SubmitButton>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setShowRegister(false)}>Back to Sign In</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Kitchen Login */}
        <TabsContent value="kitchen">
          <Card>
            <CardHeader>
              <CardTitle>Kitchen Display</CardTitle>
              <CardDescription>Enter the password to access the KDS.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={kitchenAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kitchen-password">Password</Label>
                  <Input id="kitchen-password" name="password" type="password" required defaultValue="kitchen" />
                </div>
                 {kitchenState?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{kitchenState.error}</AlertDescription>
                    </Alert>
                )}
                <SubmitButton>Access KDS</SubmitButton>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground mt-8">
        No account? This is a demo system. Use the default credentials.
      </p>
    </main>
  );
}
