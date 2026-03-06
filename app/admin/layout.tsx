import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Double check on server side layout as well
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Floating Style */}
      <div className="w-72 hidden md:block z-10 p-4 pr-0 h-full">
        <div className="h-full bg-card rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <div className="px-6 md:px-10 pt-4">
          <div className="bg-card rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] mb-4">
            <AdminHeader user={user!} />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto px-6 md:px-10 pb-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
