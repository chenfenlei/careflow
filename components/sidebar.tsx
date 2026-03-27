'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ClipboardList, FileText, HeartHandshake, Lock, Pill, ShieldCheck, Users } from 'lucide-react';
import { careRecipient } from '@/lib/mock-data';
import { cx } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Care overview', icon: ClipboardList },
  { href: '/medications', label: 'Medications', icon: Pill },
  { href: '/tasks', label: 'Tasks & visits', icon: Calendar },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/family', label: 'Family', icon: Users }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-slate-200 bg-white/95 p-5 backdrop-blur">
      <div className="mb-8 rounded-3xl border border-sky-100 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 p-5 text-white shadow-xl shadow-sky-100/40">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-2 text-sky-200">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">CareFlow</h1>
            <p className="text-sm text-slate-300">Family care coordination</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-200">
          Turn discharge notes, medications, and family updates into one clear plan people can trust.
        </p>
      </div>

      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cx(
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
              pathname === href
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Care recipient</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{careRecipient.name}</p>
        <p className="text-sm text-slate-600">{careRecipient.careStage}</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">{careRecipient.note}</p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <ShieldCheck className="h-4 w-4" /> Family can review before sharing
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-slate-500" /> Trust-first workflow</div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-500" /> Clear next steps</div>
      </div>
    </aside>
  );
}
