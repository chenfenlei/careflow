import { TasksView } from '@/components/tasks-view';
import { Topbar } from '@/components/topbar';

export default function TasksPage() {
  return (
    <>
      <Topbar title="Tasks & Visits" subtitle="See what needs to happen today, this week, and next." />
      <TasksView />
    </>
  );
}
