import { Header } from "@/components/header";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

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
        <Header user={session}/>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
