import { Header } from "@/components/header";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.userType !== 'staff') {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Logo />
            <div className="ml-auto">
                <UserNav user={session} />
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
