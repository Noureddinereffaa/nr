import React, { createContext, useContext, useState, useEffect } from 'react';
import { ARTICLES } from '../constants';
import { Article, DecisionPage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logger from '../lib/logger';

interface ContentContextType {
    articles: Article[];
    decisionPages: DecisionPage[];
    isLoading: boolean;
    addArticle: (article: Omit<Article, 'id' | 'date' | 'slug'>) => Promise<string>;
    updateArticle: (id: string, data: Partial<Article>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    addDecisionPage: (page: Omit<DecisionPage, 'id' | 'date'>) => Promise<void>;
    updateDecisionPage: (id: string, data: Partial<DecisionPage>) => Promise<void>;
    deleteDecisionPage: (id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [decisionPages, setDecisionPages] = useState<DecisionPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                setArticles(ARTICLES);
                setIsLoading(false);
                return;
            }

            try {
                const [articlesRes, decisionPagesRes] = await Promise.all([
                    supabase.from('articles').select('*'),
                    supabase.from('decision_pages').select('*')
                ]);

                if (articlesRes.data) {
                    setArticles(articlesRes.data.map((row: any) => ({
                        ...row,
                        ...(row.data || {})
                    })));
                }

                if (decisionPagesRes.data) {
                    setDecisionPages(decisionPagesRes.data.map((row: any) => ({
                        ...row,
                        ...(row.data || {})
                    })));
                }
            } catch (error) {
                Logger.error("Content Sync Error", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    const addArticle = async (article: Omit<Article, 'id' | 'date' | 'slug'>): Promise<string> => {
        const newId = crypto.randomUUID();
        const newArticle = {
            ...article,
            id: newId,
            date: new Date().toISOString(),
            slug: (article as any).slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            status: article.status || 'draft'
        } as Article;

        setArticles(prev => [newArticle, ...prev]);

        if (isSupabaseConfigured() && supabase) {
            await supabase.from('articles').insert([{
                id: newId,
                title: newArticle.title,
                slug: newArticle.slug,
                data: newArticle
            }]);
        }
        return newId;
    };

    const updateArticle = async (id: string, data: Partial<Article>) => {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
        if (isSupabaseConfigured() && supabase) {
            const current = articles.find(a => a.id === id);
            await supabase.from('articles').update({ data: { ...current, ...data } }).eq('id', id);
        }
    };

    const deleteArticle = async (id: string) => {
        setArticles(prev => prev.filter(a => a.id !== id));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('articles').delete().eq('id', id);
        }
    };

    const addDecisionPage = async (page: Omit<DecisionPage, 'id' | 'date'>) => {
        const newId = 'dp-' + Date.now();
        const newPage = { ...page, id: newId, date: new Date().toISOString() } as DecisionPage;
        setDecisionPages(prev => [newPage, ...prev]);
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('decision_pages').insert([{ id: newId, data: newPage }]);
        }
    };

    const updateDecisionPage = async (id: string, data: Partial<DecisionPage>) => {
        setDecisionPages(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        if (isSupabaseConfigured() && supabase) {
            const current = decisionPages.find(p => p.id === id);
            await supabase.from('decision_pages').update({ data: { ...current, ...data } }).eq('id', id);
        }
    };

    const deleteDecisionPage = async (id: string) => {
        setDecisionPages(prev => prev.filter(p => p.id !== id));
        if (isSupabaseConfigured() && supabase) {
            await supabase.from('decision_pages').delete().eq('id', id);
        }
    };

    return (
        <ContentContext.Provider value={{
            articles, decisionPages, isLoading,
            addArticle, updateArticle, deleteArticle,
            addDecisionPage, updateDecisionPage, deleteDecisionPage
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within a ContentProvider');
    return context;
};
