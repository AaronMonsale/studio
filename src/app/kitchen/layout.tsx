import { Header } from "@/components/header";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

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
        <Header user={session}/>
        <main className="flex-1 bg-secondary/40 p-4 sm:p-6">{children}</main>
    </div>
  );
}
