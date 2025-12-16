const fetch = require("node-fetch");
const { setGlobalOptions, params } = require("firebase-functions");
const {
    onNewFatalIssuePublished,
    onRegressionAlertPublished,
    onVelocityAlertPublished,
} = require("firebase-functions/v2/alerts/crashlytics");

setGlobalOptions({ maxInstances: 10 });

// Get webhook URL from Firebase Environment Parameters
const webhookUrl = params().ZENDUTY_WEBHOOK_URL;

if (!webhookUrl) {
    console.warn("`ZENDUTY_WEBHOOK_URL` is not set! Check Firebase Functions parameters.");
}

async function sendWebhook(alertType, event) {
    try {
        const issue = event?.data?.payload?.issue;
        if (!issue) {
            console.error("Missing issue payload", event.data);
            return;
        }

        const { id, title, subtitle, appVersion } = issue;

        const message = {
            message: `${alertType}: "${title}" (v${appVersion})`,
            summary: `${alertType}: "${subtitle ?? title}" (id ${id})`,
            details: event.data,
        };

        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });

        if (!res.ok) {
            console.error(`Webhook request failed: ${res.status} ${res.statusText}`);
        } else {
            console.log(`Webhook sent successfully for ${alertType}`);
        }
    } catch (err) {
        console.error(`Error sending webhook for ${alertType}:`, err);
    }
}

// Export functions
exports.crashWebhookNewFatal = onNewFatalIssuePublished((event) =>
    sendWebhook("New fatal crash", event)
);

exports.crashWebhookRegression = onRegressionAlertPublished((event) =>
    sendWebhook("Regression alert", event)
);

exports.crashWebhookVelocity = onVelocityAlertPublished((event) =>
    sendWebhook("Velocity alert", event)
);

// firebase functions:parameters:set ZENDUTY_WEBHOOK_URL=""