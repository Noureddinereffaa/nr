import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../../lib/services/requestService';

interface WizardData {
    serviceId: string;
    serviceTitle: string;
    packageType?: string;
    projectDetails: string;
    features: string[];
    budgetRange: string;
    timeline: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    companyName?: string;
}

interface RequestWizardContextType {
    currentStep: number;
    totalSteps: number;
    data: WizardData;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (updates: Partial<WizardData>) => void;
    submitRequest: () => Promise<void>;
    isSubmitting: boolean;
}

const RequestWizardContext = createContext<RequestWizardContextType | null>(null);

export const RequestWizardProvider: React.FC<{ children: React.ReactNode; initialData?: Partial<WizardData>; onClose: () => void }> = ({ children, initialData, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [data, setData] = useState<WizardData>({
        serviceId: '',
        serviceTitle: '',
        projectDetails: '',
        features: [],
        budgetRange: '',
        timeline: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        ...initialData
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const updateData = (updates: Partial<WizardData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const navigate = useNavigate();

    const submitRequest = async () => {
        setIsSubmitting(true);
        try {
            const result = await requestService.create({
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                serviceTitle: data.serviceTitle,
                message: data.projectDetails,
                category: data.serviceTitle, // Use title as category
                priority: 'medium',
                source: 'web',
                status: 'new'
            });

            if (result) {
                onClose();
                // Redirect to portal so they can see their new project
                navigate('/portal');
            }
        } catch (error) {
            console.error("Submission failed", error);
            // Optionally add toast here if context is available
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <RequestWizardContext.Provider value={{ currentStep, totalSteps, data, nextStep, prevStep, updateData, submitRequest, isSubmitting }}>
            {children}
        </RequestWizardContext.Provider>
    );
};

export const useRequestWizard = () => {
    const context = useContext(RequestWizardContext);
    if (!context) throw new Error('useRequestWizard must be used within RequestWizardProvider');
    return context;
};
