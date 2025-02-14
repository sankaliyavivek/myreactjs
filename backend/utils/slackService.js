const dotenv = require("dotenv");

//  Load environment variables
dotenv.config();

const sendSlackNotification = async (message) => {
    try {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;

        // Check if the Webhook URL is correctly loaded
        if (!webhookUrl) {
            console.error(" Slack Webhook URL is missing! Check your .env file.");
            return;
        }

        await axios.post(webhookUrl, { text: message });
        console.log(" Slack notification sent successfully!");
    } catch (error) {
        console.error(" Error sending Slack notification:", error.message);
    }
};

module.exports = sendSlackNotification;
