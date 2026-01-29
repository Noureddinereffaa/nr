import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-950/50 backdrop-blur-xl rounded-[2.5rem] border border-red-500/20">
                    <div className="max-w-md text-center space-y-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white">عذراً، حدث خطأ غير متوقع</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                واجه النظام مشكلة تقنية بسيطة. لا تقلق، بياناتك آمنة. يمكنك محاولة تحديث الصفحة أو العودة للرئيسية.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-6 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                            >
                                <RefreshCw size={18} />
                                تحديث الصفحة
                            </button>
                            <a
                                href="/"
                                className="flex-1 px-6 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Home size={18} />
                                الرئيسية
                            </a>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-black/40 rounded-xl text-left overflow-auto max-h-40">
                                <p className="text-[10px] font-mono text-red-400/70 whitespace-pre-wrap">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
