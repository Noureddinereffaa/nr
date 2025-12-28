import {
    SiteData,
    Article,
    SocialPost,
    ContentPlanItem,
    AIConfig
} from '../types';
import { AIService } from './ai-service';

/**
 * Growth Autopilot Engine v5.2
 * Responsible for autonomous content lifecycle management.
 */
export const AutomationEngine = {
    /**
     * Main entry point to run automation tasks
     */
    run: async (
        siteData: SiteData,
        updateSiteData: (data: Partial<SiteData>) => void,
        addArticle: (article: Omit<Article, 'id' | 'date' | 'slug'>) => Promise<void>,
        addSocialPost: (post: Omit<SocialPost, 'id'>) => Promise<void>
    ) => {
        if (!siteData.autopilot?.enabled) return;

        const now = new Date();
        const lastRun = siteData.autopilot.lastRun ? new Date(siteData.autopilot.lastRun) : null;

        // Prevent running more than once every 1 hour (allowing 3 runs theoretically, but usually triggered in batches)
        if (lastRun && (now.getTime() - lastRun.getTime() < 1 * 60 * 60 * 1000)) {
            console.log('Autopilot: Cooling down...');
            return;
        }

        console.log('Autopilot: Strategic Engine Ignited...');

        // 1. Plan Generation if empty
        let currentPlan = [...(siteData.contentPlan || [])];
        if (currentPlan.length === 0) {
            console.log('Autopilot: No plan found. Generating 30-day strategy...');
            const newPlan = await AIService.generateMonthlyPlan(siteData.aiConfig);
            updateSiteData({ contentPlan: newPlan as any });
            currentPlan = newPlan as any;
        }

        // 2. Find today's pending items
        const todayStr = now.toISOString().split('T')[0];
        const pendingItems = currentPlan.filter(item =>
            item.status === 'planned' &&
            item.scheduledDate.startsWith(todayStr)
        );

        if (pendingItems.length === 0) {
            console.log('Autopilot: No pending tasks for today.');
            updateSiteData({
                autopilot: { ...siteData.autopilot, lastRun: now.toISOString() }
            });
            return;
        }

        // 3. Process items (Limit to 3 per "run" session or based on config)
        const autopilotConfig = siteData.autopilot as any;
        const maxArticles = autopilotConfig.maxDailyPosts || 3;
        const itemsToProcess = pendingItems.slice(0, maxArticles);

        console.log(`Autopilot: Processing ${itemsToProcess.length} strategic articles...`);

        let updatedPlan = [...currentPlan];

        for (const item of itemsToProcess) {
            console.log(`Autopilot: Executing publication for: ${item.topic}`);

            // Generate full article
            const articleContent = await AIService.generateArticle(item.topic, siteData.aiConfig, true);
            await addArticle(articleContent);

            // Generate Platform-tailored social posts
            const connectedIntegrations = siteData.integrations.filter(i => i.status === 'connected');
            const targetPlatforms = connectedIntegrations.map(i => i.provider as any).filter(p => ['linkedin', 'facebook', 'twitter', 'instagram'].includes(p));

            // If no actual integrations connected, use defaults for visual feedback in UI
            const platformsToPost = targetPlatforms.length > 0 ? targetPlatforms : ['linkedin', 'twitter', 'facebook'];

            const socialPosts = await AIService.generatePlatformPosts(item.topic, siteData.aiConfig, platformsToPost);

            for (const post of socialPosts) {
                // Link post to integration if possible
                const matchingIntegration = connectedIntegrations.find(ci => ci.provider === post.platform);
                await addSocialPost({
                    ...post,
                    integrationId: matchingIntegration?.id
                });
            }

            // Update plan item status
            updatedPlan = updatedPlan.map(p =>
                p.topic === item.topic ? { ...p, status: 'published' as any } : p
            );
        }

        // Update overall state
        updateSiteData({
            contentPlan: updatedPlan as any,
            autopilot: { ...siteData.autopilot, lastRun: now.toISOString() }
        });
    }
};
