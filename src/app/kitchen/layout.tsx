import { Header } from "@/components/header";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.userType !== 'kitchen') {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Logo />
            <div className="ml-auto">
                <UserNav user={session} />
            </div>
        </header>
        <main className="flex-1 bg-secondary/40 p-4 sm:p-6">{children}</main>
    </div>
  );
}
