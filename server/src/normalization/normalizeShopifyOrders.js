export function normalizeShopifyOrder(rawOrder) {
    const money = rawOrder.totalPriceSet?.shopMoney;

    return {
        source: "shopify",

        orderId: rawOrder.id,
        orderName: rawOrder.name,

        createdAt: rawOrder.createdAt,

        financialStatus: rawOrder.displayFinancialStatus,

        revenue: Number(money?.amount ?? 0),
        currency: money?.currencyCode ?? null
    };
}

export function normalizeShopifyOrders(payload) {
    const orders = payload.data?.orders?.nodes ?? [];

    return orders.map(normalizeShopifyOrder);
}