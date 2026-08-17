export async function getMetaCampaignInsights(since, until) {
    const accessToken = requireEnv("META_ACCESS_TOKEN");
    const adAccountId = requireEnv("META_AD_ACCOUNT_ID");

    const url = new URL(
        `https://graph.facebook.com/v26.0/${adAccountId}/insights`
    );

    url.searchParams.set(
        "fields",
        "campaign_id,campaign_name,spend,impressions,clicks,actions,action_values"
    );

    url.searchParams.set("level", "campaign");
    
    const timeRange = {
        since,
        until
    };

    url.searchParams.set(
        "time_range",
        JSON.stringify(timeRange)
    );
    url.searchParams.set("time_increment", "1");

    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url);

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
            `Meta API error ${response.status}: ${errorBody}`
        );
    }

    const payload = await response.json();

    return payload;
}

function requireEnv(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}