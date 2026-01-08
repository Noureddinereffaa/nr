import React, { createContext, useContext, useState } from 'react';

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

    const submitRequest = async () => {
        setIsSubmitting(true);
        try {
            // Simulator: Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("Submitting Request:", data);

            // Should integrate with BusinessContext or Supabase here

            onClose();
        } catch (error) {
            console.error("Submission failed", error);
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
