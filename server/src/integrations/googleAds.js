import { requireEnv } from "../config/env.js";
import { getGoogleAccessToken } from "./googleAuth.js";

export async function getGoogleCampaignInsights(since, until) {
    const developerToken = requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
    const customerId = requireEnv("GOOGLE_ADS_CUSTOMER_ID").replaceAll("-", "");
    const accessToken = await getGoogleAccessToken();

    const query = `
        SELECT
            campaign.id,
            campaign.name,
            segments.date,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.conversions_value
        FROM campaign
        WHERE segments.date BETWEEN '${since}' AND '${until}'
        ORDER BY segments.date
    `;

    const url = `https://googleads.googleapis.com/v25/customers/${customerId}/googleAds:searchStream`;

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": developerToken,
        "Content-Type": "application/json"
    };

    const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replaceAll("-", "");; // don't requireEnv because login-customer-id is only for manager account

    if (loginCustomerId) {
        headers["login-customer-id"] = loginCustomerId;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Google Ads API error ${response.status}: ${errorBody}`
        );
    }

    return response.json();
}