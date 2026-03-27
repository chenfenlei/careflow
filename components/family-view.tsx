'use client';

import { useState } from 'react';
import { HeartHandshake, Plus, Users } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/lib/app-state';

export function FamilyView() {
  const { familyMembers, addFamilyMember } = useAppState();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Family member');
  const [status, setStatus] = useState('Can edit');

  const handleSubmit = () => {
    if (!name.trim()) return;
    addFamilyMember(name, role, status);
    setName('');
    setRole('Family member');
    setStatus('Can edit');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <SectionCard title="Family roles" eyebrow="Shared caregiving" icon={<Users className="h-5 w-5" />}>
          <div className="space-y-3">
            {familyMembers.map((person) => (
              <div key={person.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-semibold text-slate-900">{person.name}</p>
                  <p className="text-sm text-slate-500">{person.role}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{person.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Why this matters" eyebrow="Product promise" icon={<HeartHandshake className="h-5 w-5" />}>
          <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Less repeated texting and re-explaining.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Clear ownership for rides, pickups, and calls.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">A single source of truth after stressful hospital visits.</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Invite collaborator" eyebrow="Controlled access" icon={<Plus className="h-5 w-5" />}>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400" />
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
            <option>Can edit</option>
            <option>View only</option>
          </select>
          <button onClick={handleSubmit} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white">Add collaborator</button>
          <p className="text-sm leading-6 text-slate-500">Keep permissions simple at the MVP stage: people either help update the plan or they only review it.</p>
        </div>
      </SectionCard>
    </div>
  );
}
