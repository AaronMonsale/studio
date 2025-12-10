import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logout } from "@/lib/actions";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                        Manage your session and account details here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for future settings */}
                    <p className="text-sm text-muted-foreground">More settings coming soon.</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <form action={logout}>
                        <Button variant="destructive" type="submit">
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
