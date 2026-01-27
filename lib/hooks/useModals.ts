import { useState, useCallback } from 'react';

export interface ModalState {
    isClientModalOpen: boolean;
    isInvoiceModalOpen: boolean;
    isProjectModalOpen: boolean;
    isRequestModalOpen: boolean;
    isArticleModalOpen: boolean;
    isExpenseModalOpen: boolean;
    isServiceModalOpen: boolean;
}

export const useModals = () => {
    const [modals, setModals] = useState<ModalState>({
        isClientModalOpen: false,
        isInvoiceModalOpen: false,
        isProjectModalOpen: false,
        isRequestModalOpen: false,
        isArticleModalOpen: false,
        isExpenseModalOpen: false,
        isServiceModalOpen: false,
    });

    const openModal = useCallback((modalName: keyof ModalState) => {
        setModals(prev => ({ ...prev, [modalName]: true }));
    }, []);

    const closeModal = useCallback((modalName: keyof ModalState) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    }, []);

    const toggleModal = useCallback((modalName: keyof ModalState) => {
        setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
    }, []);

    return {
        ...modals,
        openModal,
        closeModal,
        toggleModal,
        // Semantic aliases for better DX
        openClientModal: () => openModal('isClientModalOpen'),
        closeClientModal: () => closeModal('isClientModalOpen'),
        openInvoiceModal: () => openModal('isInvoiceModalOpen'),
        closeInvoiceModal: () => closeModal('isInvoiceModalOpen'),
        openProjectModal: () => openModal('isProjectModalOpen'),
        closeProjectModal: () => closeModal('isProjectModalOpen'),
        openRequestModal: () => openModal('isRequestModalOpen'),
        closeRequestModal: () => closeModal('isRequestModalOpen'),
        openArticleModal: () => openModal('isArticleModalOpen'),
        closeArticleModal: () => closeModal('isArticleModalOpen'),
        openExpenseModal: () => openModal('isExpenseModalOpen'),
        closeExpenseModal: () => closeModal('isExpenseModalOpen'),
        openServiceModal: () => openModal('isServiceModalOpen'),
        closeServiceModal: () => closeModal('isServiceModalOpen'),
    };
};
