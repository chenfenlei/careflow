import { DashboardView } from '@/components/dashboard-view';
import { Topbar } from '@/components/topbar';

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Welcome back" subtitle="Keep track of meds, follow-ups, documents, and family tasks in one place." />
      <DashboardView />
    </>
  );
}
