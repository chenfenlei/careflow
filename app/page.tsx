import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, HeartHandshake, Lock, ShieldCheck, Users } from 'lucide-react';

const pillars = [
  {
    title: 'From discharge notes to clear next steps',
    body: 'Summaries, watch items, and task extraction make messy paperwork understandable in minutes.'
  },
  {
    title: 'One shared operating system for the family',
    body: 'Everyone sees the same medications, follow-ups, and responsibilities instead of relying on fragmented texts.'
  },
  {
    title: 'AI drafts, humans review',
    body: 'Trust comes from transparency. CareFlow helps organize information, then the family reviews before acting.'
  }
];

const benefits = [
  'Shared care dashboard for the whole family',
  'Medication and refill visibility',
  'Task ownership after hospital visits',
  'Document summaries with watch items',
  'Designed to reduce caregiver overload'
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-16 flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/20 p-3 text-sky-300"><HeartHandshake className="h-6 w-6" /></div>
            <div>
              <p className="text-xl font-semibold">CareFlow</p>
              <p className="text-sm text-slate-300">Family care coordination, built for trust</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Review before relying</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><Lock className="h-4 w-4 text-sky-300" /> Trust-first workflow</span>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-200">
              <Users className="h-4 w-4" /> Built for adult children coordinating care for a parent
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Turn medical paperwork and scattered family updates into one clear care plan.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CareFlow helps families organize medications, appointments, document summaries, and follow-up tasks after a hospital visit or during ongoing chronic care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
                Open live demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#why" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Why families trust it
              </a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" /> {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-sky-950/30 backdrop-blur">
            <div className="rounded-[28px] border border-white/10 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">CareFlow overview</p>
                  <p className="text-xl font-semibold">Mom · Post-discharge recovery</p>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Shared plan ready</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Urgent tasks</p>
                  <p className="mt-2 text-3xl font-semibold">1</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Medications</p>
                  <p className="mt-2 text-3xl font-semibold">2</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Collaborators</p>
                  <p className="mt-2 text-3xl font-semibold">3</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-white/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><FileText className="h-4 w-4 text-sky-300" /> AI document summary</div>
                <p className="text-sm leading-6 text-slate-300">
                  Continue blood pressure medication, follow up with primary care in 3–5 days, and monitor symptoms daily.
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <div className="rounded-2xl bg-white/5 px-3 py-2">• Schedule PCP follow-up</div>
                  <div className="rounded-2xl bg-white/5 px-3 py-2">• Log blood pressure daily</div>
                  <div className="rounded-2xl bg-white/5 px-3 py-2">• Watch for chest pain or shortness of breath</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="mt-24 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xl font-semibold">{pillar.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{pillar.body}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
