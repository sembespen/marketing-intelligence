import { requireEnv } from "../config/env.js";
import { getShopifyAccessToken } from "./shopifyAuth.js";

export async function getShopifyOrders() {
    const storeDomain = requireEnv("SHOPIFY_STORE_DOMAIN");
    const accessToken = await getShopifyAccessToken();

    const query = `
        query Orders {
            orders(first: 50, sortKey: CREATED_AT, reverse: true) {
                nodes {
                    id
                    name
                    createdAt
                    displayFinancialStatus
                    totalPriceSet{
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        }
    `;

    const response = await fetch(
        `https://${storeDomain}/admin/api/2026-07/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken
            },
            body: JSON.stringify({
                query
            })
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Shopify API error ${response.status}: ${errorBody}`
        );
    }

    const payload = await response.json();

    if (payload.errors) {
        throw new Error(
            `Shopify GraphQL error: ${JSON.stringify(payload.errors)}`
        );
    }

    return payload;
}