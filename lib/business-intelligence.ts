import { Client } from '../types';

export const BusinessIntelligence = {
    /**
     * Calculates a "Temperature" (0-100) for a lead based on various factors.
     */
    calculateLeadScore(client: Client): { score: number; level: 'cold' | 'warm' | 'hot' | 'boiling' } {
        let score = 0;

        // 1. Value Factor (Up to 30 points)
        if (client.value > 1000000) score += 30;
        else if (client.value > 500000) score += 20;
        else if (client.value > 100000) score += 10;

        // 2. Status Factor (Up to 30 points)
        if (client.status === 'negotiation') score += 30;
        else if (client.status === 'lead') score += 10;
        else if (client.status === 'active') score += 20;

        // 3. Activity Factor (Last contact within 7 days)
        const lastContact = new Date(client.lastContact);
        const diffDays = Math.ceil(Math.abs(Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) score += 20;
        else if (diffDays <= 7) score += 10;
        else if (diffDays > 30) score -= 10; // Cold lead

        // 4. Data Quality Factor
        if (client.email && client.phone && client.company) score += 20;

        // Clamp
        score = Math.max(0, Math.min(100, score));

        let level: any = 'cold';
        if (score >= 80) level = 'boiling';
        else if (score >= 60) level = 'hot';
        else if (score >= 30) level = 'warm';

        return { score, level };
    }
};
