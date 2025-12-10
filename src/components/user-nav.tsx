'use client';

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import type { UserSession } from "@/lib/types";
import { LogOut } from "lucide-react";

export function UserNav({ user }: { user: UserSession | null }) {
    if (!user) return null;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <form action={handleLogout}>
            <Button variant="ghost" type="submit">
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
            </Button>
        </form>
    );
}
