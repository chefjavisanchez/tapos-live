import { supabase } from './supabase';

export interface OnboardingMetrics {
    score: number;
    hasLogo: boolean;
    hasBio: boolean;
    socialCount: number;
    adCount: number;
    isActivated: boolean;
}

/**
 * Calculates the onboarding score (0-100) based on card content
 */
export function calculateOnboardingScore(cardContent: any): OnboardingMetrics {
    let score = 0;
    const hasLogo = !!cardContent?.logo_url;
    const hasBio = !!cardContent?.description || !!cardContent?.bio;

    // Check social links (expecting an array or object keys)
    const socialLinks = cardContent?.socialLinks || {};
    const socialCount = Object.keys(socialLinks).filter(key => socialLinks[key]).length;

    // Check ads (expecting customAds array)
    const ads = cardContent?.customAds || [];
    const adCount = ads.length;

    const isActivated = !!cardContent?.activated_at || cardContent?.subscription === 'active';

    if (hasLogo) score += 20;
    if (hasBio) score += 20;
    if (socialCount >= 2) score += 20;
    if (adCount >= 1) score += 20;
    if (isActivated) score += 20;

    return {
        score,
        hasLogo,
        hasBio,
        socialCount,
        adCount,
        isActivated
    };
}

/**
 * Updates the user's last_active_at timestamp and onboarding_score in metadata
 */
export async function updateCSMetrics(userId: string, cardContent: any) {
    const metrics = calculateOnboardingScore(cardContent);
    const now = new Date().toISOString();

    const { error } = await supabase.auth.updateUser({
        data: {
            last_active_at: now,
            onboarding_score: metrics.score
        }
    });

    if (error) {
        console.error('Error updating CS metrics:', error);
    }

    return metrics;
}
