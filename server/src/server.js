import express from "express";
import "dotenv/config";

import { getMetaCampaignInsights } from "./integrations/meta.js";
import { normalizeMetaCampaigns } from "./normalization/campaign.js";
import { validateDateRange } from "./validation/dateRange.js";

const app = express();
const port = 3000;

app.get("/api/health", (request, response) => {
    response.json({
        status: "ok"
    });
});

app.get("/api/meta/raw", async (request, response) => {
    const { since, until } = request.query;

    const dateRange = validateDateRange(since, until);

    const payload = await getMetaCampaignInsights(
        dateRange.since,
        dateRange.until
    );

    response.json(payload);
});

app.get("/api/meta/campaigns", async (request, response) => {
    const { since, until } = request.query;

    const dateRange = validateDateRange(since, until);

    const payload = await getMetaCampaignInsights(
        dateRange.since,
        dateRange.until
    );

    const campaigns = normalizeMetaCampaigns(payload.data);

    response.json({
        data: campaigns
    });
});

app.listen(3000, () => {
    console.log(`Server running on port ${port}`);
});

app.use((error, request, response, next) => {
    console.error(error);

    const statusCode = error.statusCode ?? 500;

    const message =
        statusCode >= 500
            ? "Internal server error."
            : error.message;

    response.status(statusCode).json({
        error: message
    });
});