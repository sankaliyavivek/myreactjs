import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from 'react-toastify'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const GoogleAuthButton = () => {
    const navigate = useNavigate('');
    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.events",
        access_type: "offline",
        prompt: "consent", // Ensures a refresh token is returned
        onSuccess: async (response) => {
            console.log("OAuth Success:", response);

            try {
                // Save tokens in backend
                const saveTokenRes = await axios.post(`${API_BASE_URL}/api/integration/save-tokens`, {
                    access_token: response.access_token,
                    refresh_token: response.refresh_token || null,
                }, { withCredentials: true });

                console.log("Tokens saved:", saveTokenRes.data);
                // alert("Google account connected!");
                toast.success('Google account connected!', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                    });
                navigate('/taskform')
            } catch (error) {
                console.error("Error saving tokens:", error.response?.data || error);
                // alert("Failed to save tokens.");
                toast.error('Failed to save tokens.', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                    });
                
            }
        },
        onError: (error) => {
            console.error("OAuth Error:", error);
            // alert("Google authentication failed.");
            toast.error('Google authentication failed.', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                });
        },
    });

    return <>
        <button className="btn google-btn" onClick={() => login()}>Connect Google</button>
        <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
        />
    </>
        ;
};

export default GoogleAuthButton;