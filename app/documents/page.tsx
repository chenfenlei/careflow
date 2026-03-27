import { DocumentsView } from '@/components/documents-view';
import { Topbar } from '@/components/topbar';

export default function DocumentsPage() {
  return (
    <>
      <Topbar title="Documents" subtitle="Upload care documents and turn them into clear action items." />
      <DocumentsView />
    </>
  );
}
