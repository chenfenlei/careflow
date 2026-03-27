import React from 'react';

export function SectionCard({
  title,
  icon,
  children,
  eyebrow
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">{icon}</div>
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p> : null}
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}
