'use client';

import { AlertTriangle, CheckCircle2, ClipboardList, FileText, Pill, ShieldCheck, Users } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { careRecipient } from '@/lib/mock-data';
import { useAppState } from '@/lib/app-state';

const priorityStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

export function DashboardView() {
  const { openTasks, urgentTasks, medications, appointments, documents, toggleTask, familyMembers, activity } = useAppState();
  const latestDocument = documents[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Open tasks</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{openTasks.length}</p>
            <p className="mt-2 text-sm text-slate-500">Everything visible in one shared plan.</p>
          </div>
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <p className="text-sm text-rose-600">Urgent follow-ups</p>
            <p className="mt-2 text-3xl font-semibold text-rose-700">{urgentTasks.length}</p>
            <p className="mt-2 text-sm text-rose-600">Needs review soon so nothing slips.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Medications</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{medications.length}</p>
            <p className="mt-2 text-sm text-slate-500">Medication changes stay visible after discharge.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Family collaborators</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{familyMembers.length}</p>
            <p className="mt-2 text-sm text-slate-500">Shared clarity lowers caregiver overload.</p>
          </div>
        </section>

        <SectionCard title="Care plan that feels trustworthy" eyebrow="Today" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{careRecipient.name}&apos;s current focus</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {careRecipient.note}. CareFlow turns discharge notes into a clean checklist with direct actions, so the family sees one agreed plan instead of scattered texts and paper notes.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Next review</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{careRecipient.nextReview}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Upcoming visit</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{appointments[0]?.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{appointments[0]?.date}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-center gap-2 text-sky-700">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">Watch items to review with family</p>
              </div>
              <div className="mt-4 space-y-3">
                {(latestDocument?.watchItems || []).map((item, index) => (
                  <div key={index} className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Next actions" eyebrow="Shared task plan" icon={<ClipboardList className="h-5 w-5" />}>
          <div className="space-y-3">
            {openTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority} priority</span>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                        {task.source === 'document_ai' ? 'AI drafted' : 'Manual'}
                      </span>
                      {task.reviewStatus ? (
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                          {task.reviewStatus === 'pending_review' ? 'Review required' : 'Approved'}
                        </span>
                      ) : null}
                    </div>
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">Due {task.dueDate} · Assigned to {task.assignedTo}</p>
                    {(task.provider || task.phone) ? <p className="mt-2 text-sm text-slate-700">{task.provider || 'Provider'} {task.phone ? `· ${task.phone}` : ''}</p> : null}
                    {task.actions?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.actions.slice(0, 2).map((action) => (
                          action.href ? <a key={action.label} href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">{action.label}</a> : null
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Mark complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="AI summary you still review" eyebrow="Latest document" icon={<FileText className="h-5 w-5" />}>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{latestDocument?.fileName}</p>
                <p className="text-xs text-slate-500">{latestDocument?.uploadedAt}</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {latestDocument?.reviewStatus === 'pending_review' ? 'Review required' : 'Approved'}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{latestDocument?.summary}</p>
            <div className="mt-4 space-y-2">
              {(latestDocument?.extractedTasks || []).map((item, index) => (
                <div key={index} className="flex items-start gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> {item}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Trust signals" eyebrow="Why families feel safe using this" icon={<Users className="h-5 w-5" />}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Everyone sees the same plan, tasks, and latest summary.</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">AI drafts actions, but caregivers review before relying on them.</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">Tasks can include direct next-step links like a portal or office phone number.</div>
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" eyebrow="Audit-friendly timeline" icon={<Pill className="h-5 w-5" />}>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
