import { NextRequest, NextResponse } from 'next/server';
import { SummarizeResult } from '@/lib/types';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You extract post-discharge care actions for a family caregiver app.
Return strict JSON with this shape:
{
  "summary": string,
  "medications": [{"name": string, "dosage": string, "frequency": string, "notes": string, "changeStatus": "new"|"continued"|"changed"|"needs_review"}],
  "tasks": [{"title": string, "dueDate": "YYYY-MM-DD", "assignedTo": string, "priority": "high"|"medium"|"low", "provider": string, "hospitalSystem": string, "phone": string, "portalUrl": string, "location": string, "reason": string, "prepItems": string[], "callScript": string}],
  "watchItems": string[]
}
Keep values concise. If unknown, use empty string or empty array. Favor caregiver-actionable tasks like scheduling follow-ups, medication confirmation, symptom logging, refill pickup, and questions for the provider.`;

function extractJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No JSON object returned');
  }
  return JSON.parse(text.slice(start, end + 1)) as SummarizeResult;
}

function guessHospitalSystem(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('yale')) return 'Yale New Haven Health';
  if (lower.includes('mass general')) return 'Mass General Brigham';
  if (lower.includes('nyu')) return 'NYU Langone';
  return 'Provider portal';
}

function guessPortal(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('yale')) return 'https://www.ynhhs.org/patient-tools/mychart';
  if (lower.includes('mychart')) return 'https://www.mychart.org';
  return 'https://www.mychart.org';
}

function heuristicResult(text: string): SummarizeResult {
  const lower = text.toLowerCase();
  const hospitalSystem = guessHospitalSystem(text);
  const portalUrl = guessPortal(text);
  const today = new Date();
  const inDays = (days: number) => {
    const copy = new Date(today);
    copy.setDate(copy.getDate() + days);
    return copy.toISOString().slice(0, 10);
  };

  const hasPcp = /primary care|pcp|follow up/.test(lower);
  const hasCardio = /cardio|heart|chest pain/.test(lower);
  const hasAntibiotic = /amoxicillin|augmentin|antibiotic/.test(lower);
  const hasMetoprolol = /metoprolol/.test(lower);
  const phone = '(203) 688-4242';
  const watchItems = [
    lower.includes('shortness of breath') ? 'Watch for shortness of breath' : 'Watch for new breathing trouble',
    lower.includes('chest pain') ? 'Escalate new or worsening chest pain' : 'Escalate worsening pain or sudden symptom changes',
    /fever|dizziness/.test(lower) ? 'Track fever or dizziness' : 'Track any dizziness, fever, or unusual fatigue'
  ];

  const medications = [
    ...(hasMetoprolol
      ? [{ name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', notes: 'Continue after discharge unless provider changes it.', changeStatus: 'continued' as const }]
      : []),
    ...(hasAntibiotic
      ? [{ name: 'Antibiotic', dosage: 'As prescribed', frequency: lower.includes('twice') ? 'Twice daily' : 'As directed', notes: 'Finish full course and confirm start date.', changeStatus: 'new' as const }]
      : [])
  ];

  const tasks = [
    ...(hasPcp
      ? [
          {
            title: 'Schedule primary care follow-up',
            dueDate: inDays(2),
            assignedTo: 'Fenlei',
            priority: 'high' as const,
            provider: 'Primary care office',
            hospitalSystem,
            phone,
            portalUrl,
            location: 'Primary care office',
            reason: 'Post-discharge follow-up',
            prepItems: ['Insurance card', 'Discharge summary', 'Medication list'],
            callScript:
              'Hi, I am calling to schedule a post-discharge follow-up. The patient was recently discharged and was told to see primary care within a few days.'
          }
        ]
      : []),
    ...(hasCardio
      ? [
          {
            title: 'Confirm whether cardiology follow-up is needed',
            dueDate: inDays(3),
            assignedTo: 'Fenlei',
            priority: 'medium' as const,
            provider: 'Cardiology office',
            hospitalSystem,
            phone,
            portalUrl,
            location: 'Cardiology clinic',
            reason: 'Recent chest pain / heart-related discharge',
            prepItems: ['Discharge summary', 'Symptom notes'],
            callScript: 'Hi, we were discharged after a chest pain evaluation. I want to confirm whether cardiology follow-up is needed and how soon it should be scheduled.'
          }
        ]
      : []),
    {
      title: 'Review medication list against discharge instructions',
      dueDate: inDays(1),
      assignedTo: 'Fenlei',
      priority: 'high' as const,
      provider: '',
      hospitalSystem,
      phone: '',
      portalUrl: '',
      location: '',
      reason: 'Make sure the home list matches the discharge plan',
      prepItems: ['Medication bottles', 'Discharge instructions'],
      callScript: ''
    },
    {
      title: 'Log symptoms once tonight',
      dueDate: inDays(0),
      assignedTo: 'Brother',
      priority: 'medium' as const,
      provider: '',
      hospitalSystem,
      phone: '',
      portalUrl: '',
      location: '',
      reason: 'Catch symptom changes early',
      prepItems: ['Blood pressure reading if available'],
      callScript: ''
    }
  ];

  return {
    summary:
      'CareFlow drafted a post-discharge plan from the uploaded note. The family should review follow-up scheduling, medication changes, and watch items before acting.',
    medications: medications.length
      ? medications
      : [
          { name: 'Medication from discharge note', dosage: 'As prescribed', frequency: 'Check paperwork', notes: 'Medication details should be reviewed against the original document.', changeStatus: 'needs_review' }
        ],
    tasks,
    watchItems
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = String(body.text ?? '').trim();

    if (!text) {
      return NextResponse.json({ error: 'Document text is required.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          temperature: 0.2,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Document text:\n${text}` }
          ]
        })
      });

      if (!response.ok) {
        const details = await response.text();
        return NextResponse.json({ error: `LLM request failed: ${details}` }, { status: 502 });
      }

      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;
      if (!content) {
        return NextResponse.json({ error: 'LLM returned no content.' }, { status: 502 });
      }

      const result = extractJson(content);
      return NextResponse.json(result);
    }

    return NextResponse.json(heuristicResult(text));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request body' }, { status: 400 });
  }
}
