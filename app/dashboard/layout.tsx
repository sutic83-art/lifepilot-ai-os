import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/dashboard');
  return <DashboardLayout>{children}</DashboardLayout>;
}
