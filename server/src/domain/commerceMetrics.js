export function calculateCommerceMetrics(orders) {
    const paidOrders = orders.filter(
        (order) => order.financialStatus === "PAID"
    );

    const actualOrders = paidOrders.length;

    const actualRevenue = paidOrders.reduce(
        (total, order) => total + order.revenue, 0
    );

    const averageOrderValue = actualOrders > 0 ? actualRevenue / actualOrders : null;

    return {
        actualOrders,
        actualRevenue,
        averageOrderValue
    };
}