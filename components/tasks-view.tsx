'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, ClipboardList, Copy, Phone, Plus } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/lib/app-state';
import { Task } from '@/lib/types';

const priorityStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

function TaskCard({ task, onDone }: { task: Task; onDone: () => void }) {
  const copyScript = async () => {
    if (!task.callScript) return;
    await navigator.clipboard.writeText(task.callScript);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority} priority</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">Assigned to {task.assignedTo}</span>
            {task.reviewStatus ? (
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-700">
                {task.reviewStatus === 'pending_review' ? 'Needs family review' : 'Approved'}
              </span>
            ) : null}
          </div>
          <p className="font-semibold text-slate-900">{task.title}</p>
          <p className="mt-1 text-sm text-slate-500">Due {task.dueDate} · {task.source === 'document_ai' ? 'Drafted from document summary' : 'Added manually'}</p>
          {task.reason ? <p className="mt-3 text-sm text-slate-700">Reason: {task.reason}</p> : null}
          {(task.provider || task.phone || task.location) ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              {task.provider ? <p><span className="font-medium text-slate-900">Provider:</span> {task.provider}</p> : null}
              {task.hospitalSystem ? <p><span className="font-medium text-slate-900">System:</span> {task.hospitalSystem}</p> : null}
              {task.phone ? <p><span className="font-medium text-slate-900">Phone:</span> {task.phone}</p> : null}
              {task.location ? <p><span className="font-medium text-slate-900">Location:</span> {task.location}</p> : null}
            </div>
          ) : null}
          {task.prepItems?.length ? (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-900">Prepare before acting</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {task.prepItems.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{item}</span>
                ))}
              </div>
            </div>
          ) : null}
          {task.callScript ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Suggested script</p>
              <p className="mt-1 leading-6">{task.callScript}</p>
            </div>
          ) : null}
          {task.actions?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {task.actions.map((action) => {
                if (action.type === 'copy_script') {
                  return (
                    <button key={action.label} onClick={copyScript} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      <Copy className="h-4 w-4" /> {action.label}
                    </button>
                  );
                }
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target={action.href?.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {action.type === 'call' ? <Phone className="h-4 w-4" /> : null}
                    {action.label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <button onClick={onDone} className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          Done
        </button>
      </div>
    </div>
  );
}

export function TasksView() {
  const { openTasks, completedTasks, addTask, toggleTask, appointments } = useAppState();
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;
    addTask(taskTitle);
    setTaskTitle('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <SectionCard title="Task board" eyebrow="What needs to happen next" icon={<ClipboardList className="h-5 w-5" />}>
          <div className="space-y-3">
            {openTasks.map((task) => (
              <TaskCard key={task.id} task={task} onDone={() => toggleTask(task.id)} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Completed" eyebrow="Progress families can see" icon={<CheckCircle2 className="h-5 w-5" />}>
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-sm text-slate-500">No completed tasks yet.</p>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="Upcoming visit" eyebrow="Care calendar" icon={<Calendar className="h-5 w-5" />}>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{appointments[0]?.title}</p>
            <p className="mt-1 text-sm text-slate-500">{appointments[0]?.provider}</p>
            <p className="mt-3 text-sm text-slate-700">{appointments[0]?.date}</p>
            <p className="text-sm text-slate-500">{appointments[0]?.location}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {appointments[0]?.portalUrl ? <a href={appointments[0].portalUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Open portal</a> : null}
              {appointments[0]?.phone ? <a href={`tel:${appointments[0].phone.replace(/[^\d+]/g, '')}`} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Call office</a> : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Add task" eyebrow="Keep it explicit" icon={<Plus className="h-5 w-5" />}>
          <div className="space-y-3">
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Call doctor, pick up meds, schedule ride..." className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400" />
            <button onClick={handleSubmit} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">Create task</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
