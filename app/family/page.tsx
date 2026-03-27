import { FamilyView } from '@/components/family-view';
import { Topbar } from '@/components/topbar';

export default function FamilyPage() {
  return (
    <>
      <Topbar title="Family" subtitle="Share caregiving tasks and keep everyone aligned." />
      <FamilyView />
    </>
  );
}
