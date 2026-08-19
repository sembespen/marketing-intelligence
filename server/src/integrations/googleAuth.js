import { requireEnv } from "../config/env.js";

export async function getGoogleAccessToken() {
    const clientId = requireEnv("GOOGLE_CLIENT_ID");
    const clientSecret = requireEnv("GOOGLE_CLIENT_SECRET");
    const refreshToken = requireEnv("GOOGLE_REFRESH_TOKEN");

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
    });

    const response = await fetch(
        "https://oauth2.googleapis.com/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Google OAuth error ${response.status}: ${errorBody}`
        );
    }

    const payload = await response.json();

    return payload.access_token;
}