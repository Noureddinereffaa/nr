import { supabase, isSupabaseConfigured } from '../supabase';
import { ServiceRequest, RequestAttachment, RequestTimelineEvent } from '../../types';
import { projectService } from './projectService';
import { clientService } from './clientService';
import { notificationService } from './notificationService';
import { sendWelcomeEmail, sendEmailNotification } from '../email-notifications';

/**
 * Service Request Management Service
 * 
 * Handles all CRUD operations and business logic for service requests.
 * Integrates with Supabase for data persistence and manages automated timeline events.
 * 
 * @module requestService
 */
export const requestService = {
    /**
     * Fetches all service requests from the database.
     * Maps both legacy JSON data and modern structured columns for backward compatibility.
     * 
     * @returns {Promise<ServiceRequest[]>} Array of service requests sorted by creation date.
     */
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
            category: r.category || r.data?.category,
            projectId: r.project_id || r.data?.projectId
        }));
    },

    /**
     * Creates a new service request and initializes its timeline.
     * 
     * @param {Omit<ServiceRequest, 'id' | 'date'>} request - The request data (excluding auto-generated fields).
     * @returns {Promise<ServiceRequest>} The newly created request object.
     */
    async create(request: Omit<ServiceRequest, 'id' | 'date'>): Promise<ServiceRequest> {
        const id = 'req-' + Date.now();
        const date = new Date().toISOString();
        let targetProjectId = request.projectId;
        let targetClientId = request.clientId;

        // Auto-Onboarding Logic: Ensure every request is linked to a Client profile and a Project
        if (request.clientEmail) {
            try {
                const normalizedEmail = request.clientEmail.toLowerCase();

                // 1. Identify or Create Client Account
                let client = await clientService.getByEmail(normalizedEmail);
                if (!client) {
                    client = await clientService.create({
                        name: request.clientName,
                        email: normalizedEmail,
                        phone: request.clientPhone || '',
                        status: 'lead'
                    });
                    console.log(`[Onboarding] New client created: ${client.id}`);
                }
                targetClientId = client.id;

                // 2. Identify or Create Project Access
                if (!targetProjectId) {
                    const existingProjects = await projectService.getByEmail(normalizedEmail);
                    if (existingProjects.length > 0) {
                        targetProjectId = existingProjects[0].id;
                        console.log(`[Onboarding] Existing project found: ${targetProjectId}`);
                    } else {
                        const newProject = await projectService.create({
                            title: `طلب استفسار: ${request.serviceTitle}`,
                            client: request.clientName,
                            client_id: targetClientId,
                            clientId: targetClientId,
                            clientEmail: normalizedEmail,
                            status: 'planning',
                            category: request.category || 'inquiry',
                            date: date,
                            fullDescription: `طلب تلقائي لعميل جديد: ${request.serviceTitle}\n\nالرسالة الأصلية:\n${request.message || ''}`,
                            technologies: [],
                            gallery: []
                        } as any);
                        targetProjectId = newProject.id;
                        console.log(`[Onboarding] New project created: ${targetProjectId}`);
                    }
                }
            } catch (error: any) {
                console.error('[Onboarding] Error during atomic linking:', error);
                // Critical: If linking fails, we need to know why. 
                // Don't swallow errors if they are related to db constraints
                if (error.code && error.message) throw error;
            }
        }

        const newRequest: ServiceRequest = {
            ...request,
            id,
            date,
            projectId: targetProjectId,
            clientId: targetClientId, // Now allowed by updated interface
            status: request.status || 'new',
            attachments: request.attachments || []
        } as ServiceRequest;

        if (isSupabaseConfigured() && supabase) {
            const { error: insertError } = await supabase.from('service_requests').insert([{
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
                project_id: targetProjectId,
                client_id: targetClientId,
                data: { ...newRequest, clientId: targetClientId, projectId: targetProjectId }
            }]);
            if (insertError) {
                console.error('[requestService] Supabase insert error:', insertError);
                throw insertError;
            }

            // 1. Trigger Welcome Email / Access Code notification to Client
            if (newRequest.clientEmail && targetProjectId) {
                sendWelcomeEmail(
                    newRequest.clientEmail,
                    newRequest.clientName,
                    newRequest.serviceTitle,
                    targetProjectId
                ).catch(err => console.error('Failed to send welcome email:', err));
            }

            // 2. Trigger Admin System Notification
            notificationService.create({
                title: 'طلب خدمة جديد 🆕',
                message: `وصل طلب جديد من ${newRequest.clientName} بخصوص "${newRequest.serviceTitle}"`,
                type: 'success'
            }).catch(err => console.error('Failed to create admin notification:', err));
        }

        return newRequest;
    },

    /**
     * Updates an existing service request and automatically records timeline events for status changes.
     * 
     * @param {string} id - The unique identifier of the request.
     * @param {Partial<ServiceRequest>} updates - The fields to update.
     * @param {ServiceRequest} currentData - The current state of the request (used for diffing and timeline).
     * @returns {Promise<ServiceRequest>} The updated request object.
     */
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
                project_id: updatedRequest.projectId,
                data: updatedRequest,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
        }

        return updatedRequest;
    },

    /**
     * Permanently deletes a service request.
     * 
     * @param {string} id - The unique identifier of the request.
     * @returns {Promise<void>}
     */
    async delete(id: string): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('service_requests').delete().eq('id', id);
            if (error) throw error;
        }
    },

    /**
     * Adds an attachment to a request and records it in the timeline.
     * 
     * @param {string} requestId - The request ID.
     * @param {RequestAttachment} attachment - The attachment object to add.
     * @param {ServiceRequest} currentData - Current request data.
     * @returns {Promise<ServiceRequest>} Updated request.
     */
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

    /**
     * Removes an attachment from a request.
     * 
     * @param {string} requestId - The request ID.
     * @param {string} attachmentId - The ID of the attachment to remove.
     * @param {ServiceRequest} currentData - Current request data.
     * @returns {Promise<ServiceRequest>} Updated request.
     */
    async removeAttachment(requestId: string, attachmentId: string, currentData: ServiceRequest): Promise<ServiceRequest> {
        const attachments = (currentData.attachments || []).filter(a => a.id !== attachmentId);
        return this.update(requestId, { attachments }, currentData);
    },

    /**
     * Manually adds a custom event to the request timeline.
     * 
     * @param {string} requestId - The request ID.
     * @param {RequestTimelineEvent} event - The timeline event object.
     * @param {ServiceRequest} currentData - Current request data.
     * @returns {Promise<ServiceRequest>} Updated request.
     */
    async addTimelineEvent(requestId: string, event: RequestTimelineEvent, currentData: ServiceRequest): Promise<ServiceRequest> {
        const timelineEvents = [...(currentData.timelineEvents || []), event];
        return this.update(requestId, { timelineEvents }, currentData);
    },

    /**
     * Retrieves the request timeline sorted by timestamp (newest first).
     * 
     * @param {ServiceRequest} request - The request object.
     * @returns {RequestTimelineEvent[]} Sorted array of timeline events.
     */
    getTimeline(request: ServiceRequest): RequestTimelineEvent[] {
        return (request.timelineEvents || []).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    },

    /**
     * Updates internal notes for administrative use. Included in the timeline as a silent update.
     * 
     * @param {string} requestId - The request ID.
     * @param {string} notes - The internal notes text.
     * @param {ServiceRequest} currentData - Current request data.
     * @returns {Promise<ServiceRequest>} Updated request.
     */
    async updateInternalNotes(requestId: string, notes: string, currentData: ServiceRequest): Promise<ServiceRequest> {
        return this.update(requestId, { internalNotes: notes }, currentData);
    },

    /**
     * Filters requests by client email for portal use.
     * 
     * @param {string} clientEmail - The client's email address.
     * @returns {Promise<ServiceRequest[]>} Filtered array of requests.
     */
    async getRequestsByClient(clientEmail: string): Promise<ServiceRequest[]> {
        const allRequests = await this.getAll();
        return allRequests.filter(r => r.clientEmail === clientEmail);
    },

    /**
     * Sends a direct reply to the client via email and logs it in the timeline.
     * 
     * @param {string} requestId - The request ID.
     * @param {string} message - The message content.
     * @param {ServiceRequest} currentData - Current request data.
     */
    async sendReply(requestId: string, message: string, currentData: ServiceRequest): Promise<void> {
        if (!currentData.clientEmail) throw new Error('Client email is missing');

        // 1. Send Email Notification
        await sendEmailNotification({
            to: currentData.clientEmail,
            subject: `تحديث من NR-OS: ${currentData.serviceTitle}`,
            title: 'رسالة جديدة بخصوص طلبك',
            message: message,
            actionUrl: `https://nr-os.com/portal`,
            actionText: 'فتح بوابة العملاء'
        });

        // 2. Record in Timeline
        const timelineEvent: RequestTimelineEvent = {
            id: 'evt-' + Date.now(),
            timestamp: new Date().toISOString(),
            type: 'crm',
            description: `تم إرسال رد إلكتروني للعميل: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
            actor: 'admin',
            metadata: { fullMessage: message }
        };

        await this.addTimelineEvent(requestId, timelineEvent, currentData);
    }
};
