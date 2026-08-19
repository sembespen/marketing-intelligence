export function normalizeGoogleCampaign(row) {
    const spend = Number(row.metrics?.costMicros ?? 0) / 1_000_000; // google reports monetary cost in micros
    const impressions = Number(row.metrics?.impressions ?? 0);
    const clicks = Number(row.metrics?.clicks ?? 0);
    const conversions = Number(row.metrics?.conversions ?? 0);
    const conversionValue = Number(row.metrics?.conversionsValue ?? 0);

    return {
        platform: "google",

        campaignId: row.campaign.id,
        campaignName: row.campaign.name,

        spend,
        impressions,
        clicks,
        conversions,
        conversionValue,

        ctr: impressions > 0 ? clicks / impressions : 0,
        cpc: clicks > 0 ? spend / clicks : null,
        costPerConversion: conversions > 0 ? spend / conversions : null,

        dateStart: row.segments.date,
        dateStop: row.segments.date
    };
}

export function normalizeGoogleCampaigns(payload) {
    const rows = payload.flatMap((batch) => {
        return batch.results ?? [];
    });

    return rows.map(normalizeGoogleCampaign);
}

