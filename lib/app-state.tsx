'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  careRecipient,
  initialActivity,
  initialAppointments,
  initialDocuments,
  initialFamilyMembers,
  initialMedications,
  initialTasks
} from '@/lib/mock-data';
import { ActivityItem, Appointment, CareDocument, FamilyMember, Medication, SummarizeResult, Task } from '@/lib/types';

type StoredAppState = {
  medications: Medication[];
  appointments: Appointment[];
  tasks: Task[];
  documents: CareDocument[];
  familyMembers: FamilyMember[];
  activity: ActivityItem[];
};

type DocumentInput = {
  text: string;
  fileName?: string;
};

type AppStateValue = {
  careRecipientName: string;
  medications: Medication[];
  appointments: Appointment[];
  tasks: Task[];
  documents: CareDocument[];
  familyMembers: FamilyMember[];
  activity: ActivityItem[];
  addMedication: (name: string, dosage: string, frequency: string) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  ingestDocument: (input: DocumentInput) => Promise<void>;
  addFamilyMember: (name: string, role: string, status: string) => void;
  openTasks: Task[];
  completedTasks: Task[];
  urgentTasks: Task[];
};

const STORAGE_KEY = 'careflow-state-v2';
const AppStateContext = createContext<AppStateValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function defaultState(): StoredAppState {
  return {
    medications: initialMedications,
    appointments: initialAppointments,
    tasks: initialTasks,
    documents: initialDocuments,
    familyMembers: initialFamilyMembers,
    activity: initialActivity
  };
}

function loadInitialState(): StoredAppState {
  if (typeof window === 'undefined') {
    return defaultState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAppState>;
    return {
      medications: parsed.medications ?? initialMedications,
      appointments: parsed.appointments ?? initialAppointments,
      tasks: parsed.tasks ?? initialTasks,
      documents: parsed.documents ?? initialDocuments,
      familyMembers: parsed.familyMembers ?? initialFamilyMembers,
      activity: parsed.activity ?? initialActivity
    };
  } catch {
    return defaultState();
  }
}

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatNow() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date());
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredAppState>(loadInitialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addActivity = (item: Omit<ActivityItem, 'id'>) => {
    setState((prev) => ({ ...prev, activity: [{ id: makeId('ac'), ...item }, ...prev.activity].slice(0, 10) }));
  };

  const addMedication = (name: string, dosage: string, frequency: string) => {
    setState((prev) => ({
      ...prev,
      medications: [
        {
          id: makeId('m'),
          recipientId: 'r1',
          name,
          dosage,
          frequency,
          reminderEnabled: true,
          notes: 'Added manually during care review.',
          changeStatus: 'needs_review'
        },
        ...prev.medications
      ]
    }));
    addActivity({ type: 'medication', title: `${name} added to the plan`, detail: `${dosage} · ${frequency}`, time: 'Just now' });
  };

  const addTask = (title: string) => {
    setState((prev) => ({
      ...prev,
      tasks: [
        {
          id: makeId('t'),
          recipientId: 'r1',
          title,
          dueDate: todayPlus(2),
          assignedTo: 'Fenlei',
          completed: false,
          source: 'manual',
          priority: 'medium',
          reviewStatus: 'approved'
        },
        ...prev.tasks
      ]
    }));
    addActivity({ type: 'task', title: 'New task created', detail: title, time: 'Just now' });
  };

  const toggleTask = (id: string) => {
    const target = state.tasks.find((task) => task.id === id);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    }));
    if (target) {
      addActivity({
        type: 'task',
        title: target.completed ? 'Task reopened' : 'Task completed',
        detail: target.title,
        time: 'Just now'
      });
    }
  };

  const ingestDocument = async ({ text, fileName }: DocumentInput) => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, fileName })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to summarize document');
    }

    const result = (await response.json()) as SummarizeResult;
    const newDocId = makeId('d');

    const newDoc: CareDocument = {
      id: newDocId,
      recipientId: 'r1',
      fileName: fileName || 'Discharge_Note.txt',
      summary: result.summary,
      extractedTasks: result.tasks.map((task) => task.title),
      watchItems: result.watchItems,
      uploadedAt: formatNow(),
      reviewStatus: 'pending_review',
      sourceText: text
    };

    const derivedTasks: Task[] = result.tasks.map((task, index) => ({
      id: makeId(`t${index}`),
      recipientId: 'r1',
      title: task.title,
      dueDate: task.dueDate || todayPlus(index === 0 ? 1 : 3),
      assignedTo: task.assignedTo || (index === 0 ? 'Fenlei' : 'Brother'),
      completed: false,
      source: 'document_ai',
      priority: task.priority || (index === 0 ? 'high' : 'medium'),
      provider: task.provider,
      hospitalSystem: task.hospitalSystem,
      phone: task.phone,
      portalUrl: task.portalUrl,
      location: task.location,
      reason: task.reason,
      prepItems: task.prepItems,
      callScript: task.callScript,
      sourceDocumentId: newDocId,
      reviewStatus: 'pending_review',
      actions: [
        ...(task.portalUrl ? [{ label: 'Open portal', type: 'open_portal' as const, href: task.portalUrl }] : []),
        ...(task.phone
          ? [{ label: 'Call office', type: 'call' as const, value: task.phone, href: `tel:${task.phone.replace(/[^\d+]/g, '')}` }]
          : []),
        ...(task.location
          ? [{ label: 'Open directions', type: 'directions' as const, href: `https://maps.google.com/?q=${encodeURIComponent(task.location)}` }]
          : []),
        ...(task.callScript ? [{ label: 'Copy script', type: 'copy_script' as const }] : [])
      ]
    }));

    const derivedMeds: Medication[] = result.medications.map((med) => ({
      id: makeId('m'),
      recipientId: 'r1',
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      reminderEnabled: true,
      notes: med.notes,
      changeStatus: med.changeStatus || 'needs_review',
      sourceDocumentId: newDocId
    }));

    setState((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      tasks: [...derivedTasks, ...prev.tasks],
      medications: [...derivedMeds, ...prev.medications]
    }));

    addActivity({
      type: 'document',
      title: 'New document summarized',
      detail: `Added ${derivedTasks.length} action items and ${derivedMeds.length} medication updates for review.`,
      time: 'Just now'
    });
  };

  const addFamilyMember = (name: string, role: string, status: string) => {
    setState((prev) => ({ ...prev, familyMembers: [{ id: makeId('f'), name, role, status }, ...prev.familyMembers] }));
    addActivity({ type: 'family', title: `${name} invited to the care plan`, detail: `${role} · ${status}`, time: 'Just now' });
  };

  const openTasks = useMemo(() => state.tasks.filter((task) => !task.completed), [state.tasks]);
  const completedTasks = useMemo(() => state.tasks.filter((task) => task.completed), [state.tasks]);
  const urgentTasks = useMemo(() => openTasks.filter((task) => task.priority === 'high'), [openTasks]);

  return (
    <AppStateContext.Provider
      value={{
        careRecipientName: careRecipient.name,
        medications: state.medications,
        appointments: state.appointments,
        tasks: state.tasks,
        documents: state.documents,
        familyMembers: state.familyMembers,
        activity: state.activity,
        addMedication,
        addTask,
        toggleTask,
        ingestDocument,
        addFamilyMember,
        openTasks,
        completedTasks,
        urgentTasks
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
