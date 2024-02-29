import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditProfile from "./EditProfile";

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return redirect("/login");

  return (
    <div className="p-8 w-full">
      <EditProfile key={session.user.id} user={session.user} />
    </div>
  );
}
