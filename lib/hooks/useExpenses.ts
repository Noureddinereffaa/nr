import { useState, useCallback } from 'react';
import { Expense } from '../types';
import { expenseService } from '../services/expenseService';
import Logger from '../logger';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshExpenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await expenseService.getAll();
            setExpenses(data);
        } catch (error) {
            Logger.error("Error fetching expenses", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'date'>) => {
        try {
            const newExpense = await expenseService.create(expense);
            setExpenses(prev => [newExpense, ...prev]);
            return newExpense;
        } catch (error) {
            Logger.error("Error adding expense", error);
            throw error;
        }
    }, []);

    const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
        try {
            const current = expenses.find(e => e.id === id);
            if (!current) return;
            const updated = await expenseService.update(id, updates, current);
            setExpenses(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (error) {
            Logger.error("Error updating expense", error);
            throw error;
        }
    }, [expenses]);

    const deleteExpense = useCallback(async (id: string) => {
        try {
            await expenseService.delete(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            Logger.error("Error deleting expense", error);
            throw error;
        }
    }, []);

    return {
        expenses,
        setExpenses,
        isLoading,
        refreshExpenses,
        addExpense,
        updateExpense,
        deleteExpense
    };
};
