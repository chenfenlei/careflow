'use client';

import { ChangeEvent, useState } from 'react';
import { AlertTriangle, ClipboardList, FileText, ShieldCheck, Upload } from 'lucide-react';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/lib/app-state';

const SAMPLE_TEXT = `Discharge instructions: Continue metoprolol 25mg twice daily. Start amoxicillin 500mg three times daily for 7 days. Follow up with PCP in 3-5 days. Return for chest pain, shortness of breath, fever, or dizziness.`;

export function DocumentsView() {
  const { documents, ingestDocument } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentText, setDocumentText] = useState(SAMPLE_TEXT);
  const [fileName, setFileName] = useState('Discharge_Note.txt');

  const handleProcess = async () => {
    try {
      setLoading(true);
      setError('');
      await ingestDocument({ text: documentText, fileName });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      setDocumentText(text);
    } catch {
      setError('This MVP can read pasted text or .txt files. PDF/OCR can be added in the next backend step.');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <SectionCard title="Turn paperwork into a plan" eyebrow="Document ingestion" icon={<FileText className="h-5 w-5" />}>
          <div className="space-y-3">
            <p className="text-sm leading-6 text-slate-600">
              Paste discharge text or upload a text note. If an OpenAI API key is configured on the backend, CareFlow uses a real LLM call. Otherwise it falls back to a deterministic parser so the workflow still works.
            </p>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <Upload className="h-4 w-4" /> Upload .txt note
              <input type="file" accept=".txt,text/plain" className="hidden" onChange={handleFile} />
            </label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400"
            />
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              rows={10}
              className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
              placeholder="Paste discharge note text here..."
            />
            <button
              onClick={handleProcess}
              disabled={loading || !documentText.trim()}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? 'Processing document...' : 'Create reviewed care plan'}
            </button>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="What happens next" eyebrow="Workflow" icon={<ClipboardList className="h-5 w-5" />}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">1. The document becomes a plain-language summary.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">2. CareFlow drafts tasks, medication changes, and watch items.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">3. Each task can include a portal, phone number, prep list, and call script.</div>
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        {documents.map((doc) => (
          <SectionCard key={doc.id} title={doc.fileName} eyebrow={doc.uploadedAt || 'Recently added'} icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {doc.reviewStatus === 'pending_review' ? 'Pending review' : 'Approved'}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Source preserved</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{doc.summary}</p>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Drafted next steps</p>
                <div className="mt-3 space-y-2">
                  {doc.extractedTasks.map((task, index) => (
                    <div key={index} className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                      {task}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-semibold">Watch items</p>
                </div>
                <div className="mt-3 space-y-2">
                  {doc.watchItems.map((item, index) => (
                    <div key={index} className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
