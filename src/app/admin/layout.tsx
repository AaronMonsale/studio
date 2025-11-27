import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { WelcomeToast } from "@/components/welcome-toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.userType !== 'admin') {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: Add footer content like a theme toggle */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
                <Header user={session} />
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <WelcomeToast name={session.name} />
              {children}
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
