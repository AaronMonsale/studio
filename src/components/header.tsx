import { UserNav } from "@/components/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import type { UserSession } from "@/lib/types";

export function Header({ user }: { user: UserSession | null }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="hidden md:block">
              <Logo />
            </div>
        </header>
    );
}
