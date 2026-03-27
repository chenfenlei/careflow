import { Bell, ShieldCheck, Sparkles } from 'lucide-react';
import { careRecipient } from '@/lib/mock-data';

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Reviewed family plan
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current care stage</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{careRecipient.careStage}</p>
            <p className="mt-1 text-xs text-slate-500">{careRecipient.nextReview}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="rounded-2xl bg-slate-950 p-2 text-white"><Sparkles className="h-4 w-4" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">AI helps draft</p>
              <p className="text-xs text-slate-500">You still review every plan before it is trusted.</p>
            </div>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
