import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { I18nProvider } from "@/lib/i18n/context";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <I18nProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </I18nProvider>
  );
}
