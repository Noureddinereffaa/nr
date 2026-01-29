import { supabase, isSupabaseConfigured } from '../supabase';
import { ServiceRequest, RequestAttachment, RequestTimelineEvent } from '../../types';

export const requestService = {
    async getAll(): Promise<ServiceRequest[]> {
        if (!isSupabaseConfigured() || !supabase) return [];
        // Select both structured and data columns for resilience
        const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((r: any) => ({
            ...r.data, // Fallback to raw json
            id: r.id,
            serviceTitle: r.service_title || r.data?.serviceTitle,
            clientName: r.client_name || r.data?.clientName,
            clientEmail: r.client_email || r.data?.clientEmail,
            clientPhone: r.client_phone || r.data?.clientPhone,
            status: r.status || r.data?.status || 'new',
            priority: r.priority || r.data?.priority || 'medium',
            value: Number(r.value || r.data?.value || 0),
            date: r.created_at || r.data?.date,
            attachments: r.attachments || r.data?.attachments || [],
            timelineEvents: r.timeline_events || r.data?.timelineEvents || [],
            internalNotes: r.internal_notes || r.data?.internalNotes,
            estimatedCompletion: r.estimated_completion || r.data?.estimatedCompletion,
            source: r.source || r.data?.source || 'web',
            category: r.category || r.data?.category
        }));
    },

    async create(request: Omit<ServiceRequest, 'id' | 'date'>): Promise<ServiceRequest> {
        const id = 'req-' + Date.now();
        const date = new Date().toISOString();

        // Create initial timeline event
        const initialTimeline: RequestTimelineEvent = {
            id: 'evt-' + Date.now(),
            timestamp: date,
            type: 'created',
            description: `تم إنشاء طلب جديد: ${request.serviceTitle}`,
            actor: 'client'
        };

        const newRequest = {
            ...request,
            id,
            date,
            status: request.status || 'new',
            timelineEvents: [initialTimeline],
            attachments: request.attachments || []
        } as ServiceRequest;

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').insert([{
                id,
                client_name: newRequest.clientName,
                service_title: newRequest.serviceTitle,
                client_email: newRequest.clientEmail,
                client_phone: newRequest.clientPhone,
                status: newRequest.status,
                priority: newRequest.priority || 'medium',
                value: newRequest.value || 0,
                category: newRequest.category,
                source: newRequest.source || 'web',
                attachments: newRequest.attachments,
                timeline_events: newRequest.timelineEvents,
                estimated_completion: newRequest.estimatedCompletion,
                data: newRequest
            }]);
            if (error) throw error;
        }

        return newRequest;
    },

    async update(id: string, updates: Partial<ServiceRequest>, currentData: ServiceRequest): Promise<ServiceRequest> {
        const updatedRequest = { ...currentData, ...updates };

        // Add timeline event for status changes
        if (updates.status && updates.status !== currentData.status) {
            const timelineEvent: RequestTimelineEvent = {
                id: 'evt-' + Date.now(),
                timestamp: new Date().toISOString(),
                type: 'status_change',
                description: `تم تحديث الحالة من "${currentData.status}" إلى "${updates.status}"`,
                actor: 'admin',
                metadata: { oldStatus: currentData.status, newStatus: updates.status }
            };
            updatedRequest.timelineEvents = [...(currentData.timelineEvents || []), timelineEvent];
        }

        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').update({
                client_name: updatedRequest.clientName,
                service_title: updatedRequest.serviceTitle,
                status: updatedRequest.status,
                priority: updatedRequest.priority,
                value: updatedRequest.value,
                category: updatedRequest.category,
                attachments: updatedRequest.attachments,
                timeline_events: updatedRequest.timelineEvents,
                internal_notes: updatedRequest.internalNotes,
                estimated_completion: updatedRequest.estimatedCompletion,
                data: updatedRequest,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedRequest;
    },

    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // New: Add attachment to request
    async addAttachment(requestId: string, attachment: RequestAttachment, currentData: ServiceRequest): Promise<ServiceRequest> {
        const attachments = [...(currentData.attachments || []), attachment];

        // Add timeline event
        const timelineEvent: RequestTimelineEvent = {
            id: 'evt-' + Date.now(),
            timestamp: new Date().toISOString(),
            type: 'attachment',
            description: `تم إرفاق ملف: ${attachment.fileName}`,
            actor: attachment.uploadedBy === 'client' ? 'client' : 'admin',
            metadata: { attachmentId: attachment.id, fileName: attachment.fileName }
        };

        return this.update(requestId, {
            attachments,
            timelineEvents: [...(currentData.timelineEvents || []), timelineEvent]
        }, currentData);
    },

    // New: Remove attachment from request
    async removeAttachment(requestId: string, attachmentId: string, currentData: ServiceRequest): Promise<ServiceRequest> {
        const attachments = (currentData.attachments || []).filter(a => a.id !== attachmentId);
        return this.update(requestId, { attachments }, currentData);
    },

    // New: Add timeline event
    async addTimelineEvent(requestId: string, event: RequestTimelineEvent, currentData: ServiceRequest): Promise<ServiceRequest> {
        const timelineEvents = [...(currentData.timelineEvents || []), event];
        return this.update(requestId, { timelineEvents }, currentData);
    },

    // New: Get timeline for a request
    getTimeline(request: ServiceRequest): RequestTimelineEvent[] {
        return (request.timelineEvents || []).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    },

    // New: Update internal notes (admin only)
    async updateInternalNotes(requestId: string, notes: string, currentData: ServiceRequest): Promise<ServiceRequest> {
        return this.update(requestId, { internalNotes: notes }, currentData);
    },

    // New: Get requests by client email
    async getRequestsByClient(clientEmail: string): Promise<ServiceRequest[]> {
        const allRequests = await this.getAll();
        return allRequests.filter(r => r.clientEmail === clientEmail);
    }
};

