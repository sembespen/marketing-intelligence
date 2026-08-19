export function calculateCampaignMetrics({
    spend,
    impressions,
    clicks,
    conversions,
    attributedRevenue
}) {
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : null;
    const cpa = conversions > 0 ? spend / conversions : null;
    const roas = spend > 0 && attributedRevenue != null ? attributedRevenue / spend : null;

    return {
        ctr,
        cpc,
        cpa,
        roas
    }
}