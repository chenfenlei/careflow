import { MedicationsView } from '@/components/medications-view';
import { Topbar } from '@/components/topbar';

export default function MedicationsPage() {
  return (
    <>
      <Topbar title="Medications" subtitle="Track current medications, dosages, reminders, and refill timing." />
      <MedicationsView />
    </>
  );
}
