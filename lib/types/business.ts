export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    address?: string;
    status: 'lead' | 'negotiation' | 'active' | 'completed' | 'lost';
    value: number;
    tags: string[];
    lastContact: string;
    notes: string;
}

export interface Service {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    price: number;
    priceLabel?: string;
    features: string[];
    deliverables?: string[];
    duration?: string;
    popular?: boolean;
}

export interface RequestMessage {
    id: string;
    role: 'client' | 'admin' | 'system';
    content: string;
    date: string;
}

export interface RequestAttachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: 'client' | 'admin';
    uploadedAt: string;
}

export interface RequestTimelineEvent {
    id: string;
    timestamp: string;
    type: 'status_change' | 'message' | 'attachment' | 'note' | 'payment' | 'created';
    description: string;
    actor: 'client' | 'admin' | 'system';
    metadata?: any;
}

export interface ServiceRequest {
    id: string;
    serviceId?: string;
    serviceTitle: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    company?: string;
    projectDetails?: string;
    details?: string;
    priority?: 'low' | 'medium' | 'high';
    budget?: string;
    timeline?: string;
    status: 'new' | 'review' | 'proposal' | 'negotiation' | 'accepted' | 'rejected' | 'completed';
    date: string;
    messages?: RequestMessage[];
    value?: number;
    message?: string;
    projectId?: string;  // Link to associated project
    clientId?: string;   // Link to associated client
    attachments?: RequestAttachment[];  // Enhanced: Full attachment objects
    timelineEvents?: RequestTimelineEvent[];  // New: Timeline tracking
    internalNotes?: string;  // New: Admin-only notes
    estimatedCompletion?: string;  // New: Expected completion date
    source?: 'web' | 'portal' | 'portal_support' | 'api';  // New: Track request source
    category?: string;  // New: Request category/type
}

export interface ProjectTask {
    id: string;
    title: string;
    status: 'todo' | 'doing' | 'done';
}

export interface ProjectMilestone {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
}

export interface ProjectActivity {
    id: string;
    date: string;
    text: string;
    type: 'status_change' | 'comment' | 'task_update' | 'milestone_reach';
    user?: string;
}

export interface Project {
    id: string;
    title: string;
    category: string;
    image: string;
    status: 'planning' | 'in-progress' | 'completed' | 'archived';
    featured: boolean;
    gallery: string[];
    tags: string[];
    links?: {
        demo?: string;
        github?: string;
        design?: string;
    };
    caseStudy?: {
        problem: string;
        solution: string;
        result: string;
    };
    fullDescription: string;
    client: string;
    clientId?: string;      // NR-OS Standard
    client_id?: string;     // DB Standard
    clientEmail?: string;   // For consistent linking
    date: string;
    technologies: string[];
    tasks?: ProjectTask[];
    milestones?: ProjectMilestone[];
    activity?: ProjectActivity[];
    budget?: number;
    stats?: string;
    challenges?: string;
    solutions?: string;
    priority?: 'low' | 'normal' | 'high';
}
