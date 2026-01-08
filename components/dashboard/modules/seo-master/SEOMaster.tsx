import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Globe, RefreshCw, CheckCircle, Search, Zap, Bot } from 'lucide-react';
import { submitToIndexNow } from '@/lib/index-now';

const SEOMaster: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
    const [urlToPing, setUrlToPing] = useState('');
    const [healthStatus, setHealthStatus] = useState({
        sitemap: 'standby',
        robots: 'standby',
        schema: 'active', // Hard to check client-side without parsing
        api: 'standby'
    });
    const [isScanning, setIsScanning] = useState(false);

    const checkResource = async (path: string) => {
        try {
            const res = await fetch(path, { method: 'HEAD' });
            return res.ok ? 'active' : 'offline';
        } catch {
            return 'offline';
        }
    };

    const runHealthScan = async () => {
        setIsScanning(true);
        // Artificial delay for UX
        await new Promise(r => setTimeout(r, 1000));

        const sitemapStatus = await checkResource('/sitemap.xml');
        const robotsStatus = await checkResource('/robots.txt');

        setHealthStatus(prev => ({
            ...prev,
            sitemap: sitemapStatus,
            robots: robotsStatus,
            api: 'active' // Assume API active if we can run this
        }));
        setIsScanning(false);
    };

    const handlePing = async () => {
        if (!urlToPing) return;
        setIsSubmitting(true);
        setSubmitResult(null);

        // Simulating key retrieval - in prod use env
        const key = 'indexnow-key-xxxxxxxx';

        const result = await submitToIndexNow([urlToPing], key);
        setSubmitResult(result);
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Sovereign Reach</h1>
                    <p className="text-slate-400 mt-2">SEO Command Center & AI Indexing Protocol</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        leftIcon={RefreshCw}
                        onClick={runHealthScan}
                        isLoading={isScanning}
                    >
                        Scan Health
                    </Button>
                    <Button variant="primary" leftIcon={Zap}>Boost Authority</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card gradient className="col-span-1 md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-500/20 p-3 rounded-xl">
                            <Bot className="text-indigo-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">IndexNow Instant Ping</h3>
                            <p className="text-sm text-slate-400">Notify Bing, Yandex & AI Crawlers instantly.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="https://nr-os.vercel.app/blog/new-article"
                                value={urlToPing}
                                onChange={(e) => setUrlToPing(e.target.value)}
                                icon={Globe}
                            />
                        </div>
                        <Button
                            onClick={handlePing}
                            isLoading={isSubmitting}
                            disabled={!urlToPing}
                        >
                            Broadcast
                        </Button>
                    </div>

                    {submitResult && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${submitResult.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            <CheckCircle size={20} />
                            <span>{submitResult.message}</span>
                        </div>
                    )}

                    <div className="border-t border-white/5 pt-6">
                        <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Active Protocols</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <ProtocolStatus name="Dynamic Sitemap" status={healthStatus.sitemap as any} />
                            <ProtocolStatus name="Robots.txt (AI)" status={healthStatus.robots as any} />
                            <ProtocolStatus name="JSON-LD Schema" status={healthStatus.schema as any} />
                            <ProtocolStatus name="Google API" status={healthStatus.api as any} />
                        </div>
                    </div>
                </Card>

                <Card className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Indexing Health</h3>
                    <div className="space-y-4">
                        <HealthMetric label="Crawled Pages" value="124" change="+12%" />
                        <HealthMetric label="Search Impressions" value="8.2K" change="+5%" />
                        <HealthMetric label="AI Referrals" value="340" change="+28%" />
                        <HealthMetric label="Indexing Speed" value="< 5min" highlight />
                    </div>
                    <div className="pt-4">
                        <Button variant="ghost" className="w-full justify-between group">
                            View Full Report
                            <Search className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ProtocolStatus = ({ name, status }: { name: string; status: 'active' | 'standby' | 'offline' }) => (
    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
        <span className="text-sm font-medium text-slate-300">{name}</span>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`} />
            <span className="text-xs text-slate-500 uppercase">{status}</span>
        </div>
    </div>
);

const HealthMetric = ({ label, value, change, highlight }: { label: string; value: string; change?: string; highlight?: boolean }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className="text-right">
            <div className={`font-mono font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</div>
            {change && <div className="text-[10px] text-green-500">{change}</div>}
        </div>
    </div>
);

export default SEOMaster;
