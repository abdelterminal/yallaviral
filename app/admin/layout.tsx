import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin';
  }

  if (!user || !isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Spacer for fixed sidebar */}
      <div className="w-20 shrink-0 hidden md:block" />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader user={user!} />
        <main className="flex-1 p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
