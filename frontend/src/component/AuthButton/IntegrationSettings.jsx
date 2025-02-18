import { useState, useEffect } from "react";
import GoogleAuthButton from "./GoogleAuthButton";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// console.log(clientId)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const IntegrationSettings = () => {
    const [integrationStatus, setIntegrationStatus] = useState({
        googleCalendar: false,
        // slack: false,
        userId: null,
    });
    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);


    useEffect(() => {
        fetchIntegrationStatus();
    }, []);

    const fetchIntegrationStatus = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/integration/status`, {
                withCredentials: true,
            });

            console.log("Fetched integration status:", data); // Debugging log

            setIntegrationStatus({
                googleCalendar: !!data.googleCalendar,
                userId: data.userId,
            });
        } catch (error) {
            console.error("Error fetching integration status:", error.response?.data || error);
            alert("Failed to fetch integration status.");
        } finally {
            setLoading(false);
        }
    };


    const toggleIntegration = async (integrationType) => {
        if (!integrationStatus.userId) {
            alert("User ID is missing. Cannot toggle integration.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/integration/toggle`,
                {
                    googleCalendar: integrationType === "googleCalendar" ? !integrationStatus.googleCalendar : undefined,
                    // slack: integrationType === "slack" ? !integrationStatus.slack : undefined,/
                },
                { withCredentials: true }
            );

            setIntegrationStatus((prevState) => ({
                ...prevState,
                googleCalendar: response.data.googleCalendar,
                // slack: response.data.slack,
            }));
        } catch (error) {
            console.error("Error toggling integration:", error.response?.data || error);
            alert("Failed to toggle integration.");
        }
    };
    const disconnectGoogle = async () => {
        if (!integrationStatus.userId) return;

        if (!window.confirm("Are you sure you want to disconnect your Google account?")) {
            return;
        }

        setDisconnecting(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/integration/disconnect-google`,
                {},
                { withCredentials: true }
            );

            console.log("Google Disconnected:", response.data); // Debugging log

            setIntegrationStatus((prevState) => ({ ...prevState, googleCalendar: false }));
            alert("Google account disconnected!");
        } catch (error) {
            console.error("Error disconnecting Google:", error);
            alert("Failed to disconnect Google account.");
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="text-center">
            <h1>External Integrations</h1>

            {loading ? (
                <p>Loading integration status...</p>
            ) : (
                <>
                    <h3>Google Calendar</h3>

                    {/* Show "Connect Google" button ONLY if not connected */}
                    {!integrationStatus.googleCalendar && (
                        <GoogleOAuthProvider clientId={clientId}>
                            <GoogleAuthButton />
                        </GoogleOAuthProvider>
                    )}

                    {/* Show Integration Status */}
                    <p>Status: {integrationStatus.googleCalendar ? "Connected" : "Not Connected"}</p>

                    {/* Show Enable/Disable button */}
                    <button
                        className="btn google-btn"
                        onClick={() => toggleIntegration("googleCalendar")}
                        disabled={disconnecting}
                    >
                        {integrationStatus.googleCalendar ? "Disable Google Calendar" : "Enable Google Calendar"}
                    </button>

                    {/* Show Disconnect button ONLY if connected */}
                    {integrationStatus.googleCalendar && (
                        <button
                            className="btn google-btn"
                            onClick={disconnectGoogle}
                            disabled={disconnecting}
                        >
                            {disconnecting ? "Disconnecting..." : "Disconnect Google"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default IntegrationSettings;