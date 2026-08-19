import { calculateCampaignMetrics } from "../domain/campaignMetric.js";

function getActionValue(actions, actionType) {
    if (!Array.isArray(actions)) {
        return 0;
    }

    const action = actions.find(
        (item) => item.action_type === actionType
    );

    return Number(action?.value ?? 0);
}

export function normalizeMetaCampaign(rawCampaign) {
    const spend = Number(rawCampaign.spend ?? 0);
    const impressions = Number(rawCampaign.impressions ?? 0);
    const clicks = Number(rawCampaign.clicks ?? 0);

    const linkClicks = getActionValue(
        rawCampaign.actions,
        "link_click"
    );

    const leads = getActionValue(
        rawCampaign.actions,
        "lead"
    );

    const platformAttributedRevenue = null;

    const derivedMetrics = calculateCampaignMetrics({
        spend,
        impressions,
        clicks,
        conversions: leads,
        attributedRevenue: platformAttributedRevenue
    });

    return {
        platform: "meta",

        campaignId: rawCampaign.campaign_id,
        campaignName: rawCampaign.campaign_name,

        date: rawCampaign.date_start,

        spend,
        impressions,
        clicks,
        linkClicks,
        
        primaryConversionType: "lead",
        primaryConversions: leads,

        platformAttributedRevenue,
        
        ...derivedMetrics
    };
}

export function normalizeMetaCampaigns(rawCampaigns) {
    return rawCampaigns.map(normalizeMetaCampaign);
}