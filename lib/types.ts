export type MedicationChangeStatus = 'new' | 'continued' | 'changed' | 'needs_review';

export type Medication = {
  id: string;
  recipientId: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderEnabled: boolean;
  refillDate?: string;
  notes?: string;
  changeStatus?: MedicationChangeStatus;
  sourceDocumentId?: string;
};

export type Appointment = {
  id: string;
  recipientId: string;
  title: string;
  provider: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed';
  portalUrl?: string;
  phone?: string;
};

export type TaskActionType = 'open_portal' | 'call' | 'directions' | 'view_document' | 'copy_script';

export type TaskAction = {
  label: string;
  type: TaskActionType;
  href?: string;
  value?: string;
};

export type Task = {
  id: string;
  recipientId: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
  source: 'manual' | 'document_ai';
  priority: 'high' | 'medium' | 'low';
  provider?: string;
  hospitalSystem?: string;
  phone?: string;
  portalUrl?: string;
  location?: string;
  reason?: string;
  prepItems?: string[];
  callScript?: string;
  sourceDocumentId?: string;
  reviewStatus?: 'pending_review' | 'approved';
  actions?: TaskAction[];
};

export type CareDocument = {
  id: string;
  recipientId: string;
  fileName: string;
  summary: string;
  extractedTasks: string[];
  watchItems: string[];
  uploadedAt?: string;
  reviewStatus?: 'pending_review' | 'approved';
  sourceText?: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  status: string;
};

export type CareRecipient = {
  id: string;
  name: string;
  relationship: string;
  note: string;
  careStage: string;
  nextReview: string;
};

export type ActivityItem = {
  id: string;
  type: 'task' | 'document' | 'family' | 'medication';
  title: string;
  detail: string;
  time: string;
};

export type SummarizeResult = {
  summary: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    notes?: string;
    changeStatus?: MedicationChangeStatus;
  }>;
  tasks: Array<{
    title: string;
    dueDate: string;
    assignedTo: string;
    priority: 'high' | 'medium' | 'low';
    provider?: string;
    hospitalSystem?: string;
    phone?: string;
    portalUrl?: string;
    location?: string;
    reason?: string;
    prepItems?: string[];
    callScript?: string;
  }>;
  watchItems: string[];
};
