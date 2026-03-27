'use client';

import { useState } from 'react';
import { Clock3, Pill, Plus, ShieldCheck } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/lib/app-state';

const changeStyles = {
  new: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  continued: 'border-slate-200 bg-slate-50 text-slate-700',
  changed: 'border-amber-200 bg-amber-50 text-amber-700',
  needs_review: 'border-sky-200 bg-sky-50 text-sky-700'
};

export function MedicationsView() {
  const { medications, addMedication } = useAppState();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim() || !frequency.trim()) return;
    addMedication(name, dosage, frequency);
    setName('');
    setDosage('');
    setFrequency('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <SectionCard title="Medication plan" eyebrow="What changed after discharge" icon={<Pill className="h-5 w-5" />}>
        <div className="grid gap-4 md:grid-cols-2">
          {medications.map((med) => (
            <div key={med.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{med.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{med.dosage} · {med.frequency}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {med.reminderEnabled && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Reminder on</span>}
                  {med.changeStatus ? <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${changeStyles[med.changeStatus]}`}>{med.changeStatus.replace('_', ' ')}</span> : null}
                </div>
              </div>
              {med.notes ? <p className="mt-3 text-sm leading-6 text-slate-500">{med.notes}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                {med.refillDate ? <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Refill by {med.refillDate}</span> : null}
                {med.sourceDocumentId ? <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Linked to uploaded document</span> : null}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Add medication" eyebrow="Manual entry" icon={<Plus className="h-5 w-5" />}>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medication name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 placeholder:text-slate-400" />
            <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 placeholder:text-slate-400" />
            <input value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Frequency" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 placeholder:text-slate-400" />
            <button onClick={handleSubmit} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">Save medication</button>
          </div>
        </SectionCard>

        <SectionCard title="Why this feels safer" eyebrow="Trust" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">The list now shows what is new, continued, changed, or still needs review.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Families can compare medications against the uploaded discharge note before acting.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">This is meant to reduce confusion, not replace the provider&apos;s official instructions.</div>
          </div>
        </SectionCard>

        <SectionCard title="Best practice" eyebrow="Simple operating rule" icon={<Clock3 className="h-5 w-5" />}>
          <p className="text-sm leading-6 text-slate-600">
            Use CareFlow as the shared family reference, then confirm final medication changes with the care team before taking action.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
