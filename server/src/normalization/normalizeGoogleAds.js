import { calculateCampaignMetrics } from "../domain/campaignMetric.js";

export function normalizeGoogleCampaign(row) {
    const spend = Number(row.metrics?.costMicros ?? 0) / 1_000_000; // google reports monetary cost in micros
    const impressions = Number(row.metrics?.impressions ?? 0);
    const clicks = Number(row.metrics?.clicks ?? 0);
    const conversions = Number(row.metrics?.conversions ?? 0);
    const platformAttributedRevenue = Number(row.metrics?.conversionsValue ?? 0);

    const derivedMetrics = calculateCampaignMetrics({
        spend,
        impressions,
        clicks,
        conversions,
        attributedRevenue: platformAttributedRevenue
    });

    return {
        platform: "google",

        campaignId: row.campaign.id,
        campaignName: row.campaign.name,

        date: row.segments.date,

        spend,
        impressions,
        clicks,

        primaryConversionType: "conversion",
        primaryConversions: conversions,

        platformAttributedRevenue,

        ...derivedMetrics
    };
}

export function normalizeGoogleCampaigns(payload) {
    const rows = payload.flatMap((batch) => {
        return batch.results ?? [];
    });

    return rows.map(normalizeGoogleCampaign);
}

