import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import ArticleReader from '../components/ArticleReader';

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { articles } = useContent();

    const article = articles?.find(a => a.slug === slug);

    useEffect(() => {
        if (!article && articles && articles.length > 0) {
            // Article not found, redirect to blog
            navigate('/blog');
        }
    }, [article, articles, navigate]);

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return <ArticleReader article={article} onClose={() => navigate('/blog')} />;
};

export default ArticlePage;
