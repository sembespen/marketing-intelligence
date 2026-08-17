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

    const ctr = impressions === 0
        ? 0
        : clicks / impressions;
    
    const cpc = clicks === 0
        ? 0
        : spend / clicks;

    const costPerLead = leads === 0
        ? 0
        : spend / leads;

    return {
        platform: "meta",
        campaignId: rawCampaign.campaign_id,
        campaignName: rawCampaign.campaign_name,

        spend,
        impressions,
        clicks,
        linkClicks,
        leads,
        
        ctr,
        cpc,
        costPerLead,

        dateStart: rawCampaign.date_start,
        dateStop: rawCampaign.date_stop
    };
}

export function normalizeMetaCampaigns(rawCampaigns) {
    return rawCampaigns.map(normalizeMetaCampaign);
}

function getActionValue(actions, actionType) {
    if (!Array.isArray(actions)) {
        return 0;
    }

    const action = actions.find(
        (item) => item.action_type === actionType
    );

    return Number(action?.value ?? 0);
}