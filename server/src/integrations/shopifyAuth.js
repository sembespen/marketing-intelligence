import { requireEnv } from "../config/env.js";

export async function getShopifyAccessToken() {
    const storeDomain = requireEnv("SHOPIFY_STORE_DOMAIN");
    const clientId = requireEnv("SHOPIFY_CLIENT_ID");
    const clientSecret = requireEnv("SHOPIFY_CLIENT_SECRET");

    const response = await fetch(
        `https://${storeDomain}/admin/oauth/access_token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret
            })
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Shopify auth error ${response.status}: ${errorBody}`
        );
    }

    const payload = await response.json();

    return payload.access_token;
}