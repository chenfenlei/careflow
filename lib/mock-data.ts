import { ActivityItem, Appointment, CareDocument, CareRecipient, FamilyMember, Medication, Task } from '@/lib/types';

export const careRecipient: CareRecipient = {
  id: 'r1',
  name: 'Mom',
  relationship: 'Mother',
  note: 'Recent discharge after chest pain evaluation · first week at home is still in progress',
  careStage: 'Post-discharge recovery',
  nextReview: 'Care plan review tomorrow at 6:00 PM'
};

export const initialMedications: Medication[] = [
  {
    id: 'm1',
    recipientId: 'r1',
    name: 'Metoprolol',
    dosage: '25mg',
    frequency: 'Twice daily',
    reminderEnabled: true,
    refillDate: '2026-04-02',
    notes: 'Continue after discharge. Take with breakfast and dinner.',
    changeStatus: 'continued',
    sourceDocumentId: 'd1'
  },
  {
    id: 'm2',
    recipientId: 'r1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily for 7 days',
    reminderEnabled: true,
    refillDate: '2026-03-31',
    notes: 'New medication. Finish full course even if symptoms improve.',
    changeStatus: 'new',
    sourceDocumentId: 'd1'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'a1',
    recipientId: 'r1',
    title: 'Cardiology Follow-up',
    provider: 'Dr. Lee',
    date: '2026-03-29 10:00 AM',
    location: 'Yale New Haven Clinic',
    status: 'upcoming',
    portalUrl: 'https://www.ynhhs.org/patient-tools/mychart',
    phone: '(203) 688-4242'
  }
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    recipientId: 'r1',
    title: 'Schedule PCP visit within 3 days',
    dueDate: '2026-03-27',
    assignedTo: 'Fenlei',
    completed: false,
    source: 'document_ai',
    priority: 'high',
    provider: 'Dr. Patel',
    hospitalSystem: 'Yale New Haven Health',
    phone: '(203) 688-4242',
    portalUrl: 'https://www.ynhhs.org/patient-tools/mychart',
    reason: 'Post-discharge blood pressure review',
    prepItems: ['Insurance card', 'Discharge summary', 'Current medication list'],
    callScript:
      'Hi, I am calling to schedule a primary care follow-up for my mother after a recent discharge. She was told to be seen within 3 days for blood pressure review.',
    sourceDocumentId: 'd1',
    reviewStatus: 'pending_review',
    actions: [
      { label: 'Open portal', type: 'open_portal', href: 'https://www.ynhhs.org/patient-tools/mychart' },
      { label: 'Call office', type: 'call', value: '(203) 688-4242', href: 'tel:+12036884242' },
      { label: 'Copy script', type: 'copy_script' }
    ]
  },
  {
    id: 't2',
    recipientId: 'r1',
    title: 'Pick up prescription from pharmacy',
    dueDate: '2026-03-26',
    assignedTo: 'Brother',
    completed: false,
    source: 'manual',
    priority: 'medium',
    location: 'CVS, 1150 Whalley Ave, New Haven',
    prepItems: ['Prescription name', 'Insurance card'],
    actions: [{ label: 'Open directions', type: 'directions', href: 'https://maps.google.com/?q=CVS%201150%20Whalley%20Ave%20New%20Haven' }]
  },
  {
    id: 't3',
    recipientId: 'r1',
    title: 'Log blood pressure tonight',
    dueDate: '2026-03-26',
    assignedTo: 'Fenlei',
    completed: true,
    source: 'document_ai',
    priority: 'medium',
    reviewStatus: 'approved'
  }
];

export const initialDocuments: CareDocument[] = [
  {
    id: 'd1',
    recipientId: 'r1',
    fileName: 'Hospital_Discharge.pdf',
    summary:
      'Continue blood pressure medication, monitor symptoms daily, and follow up with primary care within 3–5 days. Keep a clear log so family members stay aligned.',
    extractedTasks: ['Schedule PCP follow-up', 'Log blood pressure daily', 'Confirm refill pickup'],
    watchItems: ['Escalate worsening chest pain', 'Watch for shortness of breath', 'Track fever or dizziness'],
    uploadedAt: 'Today · 9:42 AM',
    reviewStatus: 'pending_review',
    sourceText:
      'Discharge instructions: Continue metoprolol 25mg twice daily. Start amoxicillin 500mg three times daily for 7 days. Follow up with PCP within 3-5 days. Return for chest pain, shortness of breath, fever, or dizziness.'
  }
];

export const initialFamilyMembers: FamilyMember[] = [
  { id: 'f1', name: 'Fenlei', role: 'Primary caregiver', status: 'Can edit' },
  { id: 'f2', name: 'Brother', role: 'Transportation + pharmacy', status: 'Can edit' },
  { id: 'f3', name: 'Aunt', role: 'Check-in support', status: 'View only' }
];

export const initialActivity: ActivityItem[] = [
  {
    id: 'ac1',
    type: 'document',
    title: 'Discharge note summarized',
    detail: 'AI extracted tasks, medication changes, and watch items for family review.',
    time: '9 min ago'
  },
  {
    id: 'ac2',
    type: 'family',
    title: 'Brother assigned pharmacy pickup',
    detail: 'The task now includes directions so it can be completed immediately.',
    time: '28 min ago'
  },
  {
    id: 'ac3',
    type: 'medication',
    title: 'Metoprolol marked as continued after discharge',
    detail: 'Medication list now shows what changed versus what stayed the same.',
    time: '1 hr ago'
  }
];
