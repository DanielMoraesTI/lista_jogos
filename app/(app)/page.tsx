import { AccountDeletedToast } from "@/components/account-deleted-toast";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Landing } from "@/components/landing/landing";
import { getDashboardData } from "@/lib/queries";
import { displayName, getCurrentUser } from "@/lib/session";

/** Visitantes veem a landing page; usuários logados, o próprio dashboard. */
export default async function HomePage(props: PageProps<"/">) {
  const user = await getCurrentUser();
  if (!user) {
    const { conta } = await props.searchParams;
    return (
      <>
        {conta === "excluida" && <AccountDeletedToast />}
        <Landing />
      </>
    );
  }

  const data = await getDashboardData(user.id);
  return <Dashboard nickname={displayName(user)} data={data} />;
}
